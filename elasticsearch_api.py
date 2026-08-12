from elasticsearch import Elasticsearch
from datetime import datetime,timezone
import json

def get_client(cluster):
    return Elasticsearch(cluster["url"], basic_auth=( cluster["username"], cluster["password"] ))

def get_cluster_by_id(cluster_id):
    clusters = get_clusters()

    for cluster in clusters:
        if cluster["id"] == cluster_id:
            return cluster

    return None
#----Functions for cluster health history - hidden index ".cluster-health-history"------------------------
def ensure_health_history_index(es):
    index_name = ".cluster-health-history"

    if not es.indices.exists(index=index_name):
        es.indices.create( index=index_name,
            mappings={
                "properties": {
                    "cluster": { "type": "keyword"},
                    "status": {"type": "keyword"},
                    "timestamp": {"type": "date"}
                }
            }
        )

def save_cluster_health_history(es,cluster_name,status):
    ensure_health_history_index(es)

    es.index( index=".cluster-health-history",
        document={
            "cluster": cluster_name,
            "status": status,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )

def get_last_health_status(es,cluster_name):
    ensure_health_history_index(es)

    response = es.search(index=".cluster-health-history",size=1,
        sort=[
            {
                "timestamp": {
                    "order": "desc"
                }
            }
        ],
        query={
            "term": {
                "cluster": cluster_name
            }
        }
    )

    hits = response["hits"]["hits"]
    if not hits:
        return None

    return hits[0]["_source"]["status"]


def get_cluster_health_history(cluster,cluster_name,period):
    es = get_client(cluster)
    ensure_health_history_index(es)

    range_query = {
    "1h": "now-1h",
    "24h": "now-24h",
    "7d": "now-7d",
    "30d": "now-30d",
    "365d": "now-365d"
    }.get(period,"now-24h")
    
    response = es.search( index=".cluster-health-history",size=200,
        sort=[{
                "timestamp": {
                    "order": "asc"
                }
            }
        ],
        query={
                "bool":{
                    "must":[
                        {
                            "term":{
                                "cluster":cluster_name
                        }
                        },
                        {
                            "range":{
                                "timestamp":{
                                    "gte": range_query
                                }
                            }
                        }
                    ]
                }
            }
    )
    results = []

    for hit in response["hits"]["hits"]:
        results.append(hit["_source"])

    return results

#----Functions for cluster storage history - hidden index ".cluster-storage-history"------------------------------------
def ensure_storage_history_index(es):
    index_name = ".cluster-storage-history"

    if not es.indices.exists(index=index_name):
        es.indices.create(index=index_name,
            mappings={
                "properties": {
                    "cluster": {
                        "type": "keyword"
                    },
                    "total_bytes": {
                        "type": "long"
                    },
                    "used_bytes": {
                        "type": "long"
                    },
                    "free_bytes": {
                        "type": "long"
                    },
                    "usage_percent": {
                        "type": "float"
                    },
                    "timestamp": {
                        "type": "date"
                    }
                }
            }
        )

def save_cluster_storage_history(es,cluster_name,total,used,free,usage_percent):
    ensure_storage_history_index(es)
    es.index(index=".cluster-storage-history",
        document={
            "cluster": cluster_name,
            "total_bytes": total,
            "used_bytes": used,
            "free_bytes": free,
            "usage_percent": usage_percent,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )

def get_last_storage_usage(es,cluster_name):
    ensure_storage_history_index(es)

    response = es.search(
        index=".cluster-storage-history",
        size=1,
        sort=[
            {
                "timestamp": {
                    "order":"desc"
                }
            }
        ],
        query={
            "term":{
                "cluster":
                    cluster_name
            }
        }
    )
    hits = response["hits"]["hits"]

    if not hits:
        return None

    return hits[0]["_source"]["usage_percent"]

def get_cluster_storage_history(cluster,cluster_name,period):
    es = get_client(cluster)
    ensure_storage_history_index(es)

    range_query = {
        "1h": "now-1h",
        "24h": "now-24h",
        "7d": "now-7d",
        "30d": "now-30d",
        "365d": "now-365d"
                    }.get(period,"now-24h")

    response = es.search(
        index=".cluster-storage-history",
        size=200,
        sort=[
            {
                "timestamp": {
                    "order": "asc"
                }
            }
        ],
        query={
            "bool":{
                "must":[
                    {
                        "term":{
                            "cluster": cluster_name
                        }
                    },
                    {
                        "range":{
                            "timestamp":{
                                "gte": range_query
                            }
                        }
                    }
                ]
            }
        }
    )

    results = []

    for hit in response["hits"]["hits"]:
        results.append(hit["_source"])

    return results
#--------------------------------------------------------------------------------------------

def get_clusters():
    with open("clusters.json","r") as f:
        data = json.load(f)
    return data["clusters"]

def get_nodes(cluster):

    es = get_client(cluster)
    response = es.nodes.info()
    nodes = []

    for node_id, node_data in response["nodes"].items():
        nodes.append({
            "id": node_id,
            "name": node_data["name"],
            "ip": node_data.get("ip",""),
            "host": node_data.get("host",""),
            "version": node_data.get("version", "")
        })
        
    nodes.sort(key=lambda x: x["name"]) #Θέλω να επιστρέφει με την σειρά τους nodes.

    return nodes

def get_users(cluster):
    es = get_client(cluster)

    response = es.security.get_user()
    users = []

    for username, data in response.items():
        users.append({
            "username": username,
            "full_name": data.get("full_name",""),
            "email": data.get("email", ""),
            "roles": data.get("roles",[]),
            "enabled": data.get("enabled",True)
        })
    return users

def get_cluster_health(cluster):
    es = get_client(cluster)

    health = es.cluster.health()
    last_status = get_last_health_status(es,health["cluster_name"])

    if last_status != health["status"]:
        save_cluster_health_history(es,health["cluster_name"],health["status"])

    return{
        "cluster_name": health["cluster_name"],
        "status": health["status"],
        "number_of_nodes": health["number_of_nodes"],
        "number_of_data_nodes": health["number_of_data_nodes"],
        "active_shards": health["active_shards"],
        "active_primary_shards": health["active_primary_shards"],
        "unassigned_shards": health["unassigned_shards"],
        "pending_tasks": health["number_of_pending_tasks"],
    }

def get_indices(cluster):
    es = get_client(cluster)
    response = es.cat.indices(format="json")

    indices = []
    for index in response:

        #Μετατρέπω-Κοβω το όνομα των indices 
        #π.χ.  .ds-.workflows-events-2026.07.30 ==> workflows-events
        display_name = index["index"]
        display_name = display_name.replace(".ds-.", "")
        display_name = display_name.replace(".internal.", "")
        display_name = display_name.split("-000")[0]# Κόβουμε το generation suffix
        parts = display_name.split("-")# Αν υπάρχει ημερομηνία στο τέλος την αφαιρούμε

        if len(parts) >= 3:
            last_parts = parts[-1:]
            if "." in last_parts:
                display_name = "-".join(parts[:-1])

            # alerts-security.alerts-default -> alerts-security
        if "." in display_name:
            display_name = display_name.split(".")[0]

        #Εδώ είναι που κρύβω τον index που φτιάχνω για να αποθηκεύονται μέσα σε αυτόν όλα τα records για το health του cluster.
        #Όταν δηλαδή το Cluster π.χ. αλλάξει από Green σε Yellow κλπ. + 1 record,που κρατάω μέσα στον index cluster-health-history.        
        if index["index"] in [".cluster-health-history",".cluster-storage-history"]:
            continue

        indices.append({
        "name": index["index"],
        "display_name": display_name,
        "health": index["health"],
        "status": index["status"],
        "docs": index["docs.count"],
        "size": index["store.size"],
        "size_display": index["store.size"]
        })
    
    return indices

def get_shards(cluster):
    es = get_client(cluster)

    return es.cat.shards(format="json") 

def get_node_disk_usage(cluster):
    es = get_client(cluster)

    response = es.nodes.stats(metric="fs")
    disk_usage = []

    for node_id, node in response["nodes"].items():

        total = node["fs"]["total"]["total_in_bytes"]
        free = node["fs"]["total"]["available_in_bytes"]

        used = total - free

        usage_percent = round((used / total) * 100, 2)

        disk_usage.append({
            "name": node["name"],
            "total": total,
            "used": used,
            "free": free,
            "percent": usage_percent
        })

    return disk_usage


def format_storage_size(size_bytes):
    size_bytes = float(size_bytes)

    if size_bytes >= 1024 ** 4:
        return f"{size_bytes / (1024 ** 4):.2f} TB"

    elif size_bytes >= 1024 ** 3:
        return f"{size_bytes / (1024 ** 3):.2f} GB"

    elif size_bytes >= 1024 ** 2:
        return f"{size_bytes / (1024 ** 2):.2f} MB"

    elif size_bytes >= 1024:
        return f"{size_bytes / 1024:.2f} KB"

    else:
        return f"{size_bytes:.0f} B"

#helper για Elasticsearch τιμές
def elastic_size_to_bytes(value):
    value = value.lower()

    if value.endswith("tb"):
        return float(value.replace("tb", "")) * (1024 ** 4)

    if value.endswith("gb"):
        return float(value.replace("gb", "")) * (1024 ** 3)

    if value.endswith("mb"):
        return float(value.replace("mb", "")) * (1024 ** 2)

    if value.endswith("kb"):
        return float(value.replace("kb", "")) * 1024

    if value.endswith("b"):
        return float(value.replace("b", ""))

    return 0

def get_snapshot_repositories(cluster):
    es = get_client(cluster)

    return es.snapshot.get_repository()

def get_snapshots(cluster):
    es = get_client(cluster)

    repositories = es.snapshot.get_repository()
    snapshots = {}

    for repository in repositories:

        response = es.snapshot.get(
            repository=repository,
            snapshot="_all"
        )

        snapshots[repository] = response["snapshots"]

    return snapshots

