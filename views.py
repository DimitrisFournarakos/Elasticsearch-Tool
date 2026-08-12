from django.shortcuts import render,redirect
from django.http import JsonResponse
from elasticsearch_api import get_nodes,get_cluster_health,get_users,get_clusters,get_indices,get_shards,get_node_disk_usage,format_storage_size,elastic_size_to_bytes,get_snapshots,get_cluster_health_history,save_cluster_storage_history,get_client,get_last_storage_usage,get_cluster_storage_history,get_last_node_usage,save_node_history,get_node_history
import json 
from collections import defaultdict

def login_view(request):

    if request.method == "POST": #Έλεγχος αν πάτησε Login
        #Διαβάζω τα πεδία
        username = request.POST.get("username")
        password = request.POST.get("password")

        with open("users.json", "r") as f:
            data = json.load(f) # το φορτώνει ως dictionary

        for user in data["users"]:

            if ( user["username"] == username and user["password"] == password):

                return redirect("elastic_dashboard")

        return render(request,"login.html",{"error": True}) # Αν ο χρήστης δώσει λάθος στοιχεία .

    return render(request, "login.html") # Αν ο χρήστης δεν πατήσει login απλώς ανοίγω την σελίδα login.html


def elastic_dashboard(request):
    selected_cluster = request.session.get("selected_cluster")
    clusters = get_clusters()

    cluster_total = 0
    cluster_used = 0
    cluster_free = 0
    cluster_usage = 0

    cluster_total_display = 0
    cluster_used_display = 0
    cluster_free_display = 0

    primary_shards = 0
    replica_shards = 0
    total_shards = 0

    started_shards = 0
    relocating_shards = 0
    initializing_shards = 0
    unassigned_shards = 0

    total_shard_storage_bytes = 0
    total_shard_storage_display = 0
    if selected_cluster:
        nodes = get_nodes(selected_cluster)
        users = get_users(selected_cluster)
        cluster_health = get_cluster_health(selected_cluster)
        indices = get_indices(selected_cluster)
        shards = get_shards(selected_cluster)
        node_disk_usage = get_node_disk_usage(selected_cluster)
        snapshots = get_snapshots(selected_cluster)

        node_monitoring = {}
        for shard in shards:
            
            node_name = shard.get("node")
            if not node_name:
                continue

            if node_name not in node_monitoring:
                node_monitoring[node_name] = {
                            "name": node_name,
                            "primary_shards": 0,
                            "replica_shards": 0,
                            "total_shards": 0,
                            "total": 0,
                            "used": 0,
                            "free": 0,
                            "percent": 0
                        }
            node_monitoring[node_name]["total_shards"] += 1

            if shard["prirep"] == "p":
                node_monitoring[node_name]["primary_shards"] += 1

            else:
                node_monitoring[node_name]["replica_shards"] += 1
            

        for disk_node in node_disk_usage:
            if disk_node["name"] in node_monitoring:
                node_monitoring[disk_node["name"]]["total"] = disk_node["total"]
                node_monitoring[disk_node["name"]]["used"] = disk_node["used"]
                node_monitoring[disk_node["name"]]["free"] = disk_node["free"]
                node_monitoring[disk_node["name"]]["percent"] = disk_node["percent"]

                node_monitoring[disk_node["name"]]["total_display"] = format_storage_size(disk_node["total"])
                node_monitoring[disk_node["name"]]["used_display"] = format_storage_size(disk_node["used"])
                node_monitoring[disk_node["name"]]["free_display"] = format_storage_size(disk_node["free"])

        cluster_total = max(node["total"]for node in node_disk_usage)
        cluster_used = max(node["used"]for node in node_disk_usage)
        cluster_free = max(node["free"]for node in node_disk_usage)
        cluster_usage = round((cluster_used / cluster_total) * 100, 2)
        cluster_total_display = format_storage_size(cluster_total)
        cluster_used_display =  format_storage_size(cluster_used)
        cluster_free_display =  format_storage_size(cluster_free)

        #Calculate last storage_history of cluster health
        es = get_client(selected_cluster)
        last_usage = get_last_storage_usage(es,cluster_health["cluster_name"])
        if (last_usage is None  or  abs(last_usage - cluster_usage) >= 0.5):
            save_cluster_storage_history(es,cluster_health["cluster_name"],cluster_total,cluster_used,cluster_free,cluster_usage)

        #Calculate last storage_history of cluster node
        es = get_client(selected_cluster)
        for disk_node in node_disk_usage:
            last_usage = get_last_node_usage(es,disk_node["name"])

            if (last_usage is None  or  abs(last_usage - disk_node["percent"]) >= 0.5):
                save_node_history(es,cluster_health["cluster_name"],disk_node["name"],disk_node["total"],disk_node["used"],disk_node["free"],disk_node["percent"])


        primary_shards = 0
        replica_shards = 0
        started_shards = 0
        relocating_shards = 0
        initializing_shards = 0
        unassigned_shards = 0

        for shard in shards:
            state = shard["state"]

            if state == "STARTED":
                started_shards += 1

            elif state == "RELOCATING":
                relocating_shards += 1

            elif state == "INITIALIZING":
                initializing_shards += 1

            elif state == "UNASSIGNED":
                unassigned_shards += 1

            if shard["prirep"] == "p":
                primary_shards += 1
            else:
                replica_shards += 1
        total_shards = ( primary_shards + replica_shards )

       

        for shard in shards:
            store = shard.get("store")

            if not store:
                continue
            store = store.lower()

            try:
                total_shard_storage_bytes += elastic_size_to_bytes(shard["store"])
            except:
                pass

        total_shard_storage_display = format_storage_size(total_shard_storage_bytes)

        for index in indices:
            index["shards"] = []

            for shard in shards:
                if shard["index"] == index["name"]:

                    index["shards"].append({
                        "id": shard["shard"],
                        "prirep": shard["prirep"],
                        "state": shard["state"],
                        "node": shard["node"],
                        "docs": shard["docs"],
                        "store": shard["store"],
                        "dataset": shard["dataset"],
                        "ip": shard["ip"]
                    })
        
    else:
        nodes = []
        users = []
        cluster_health = {}
        indices = []
        shards= []
        node_disk_usage = []
        node_monitoring = {}
        snapshots  = {}

    
    grouped_roles = defaultdict(list)

    for user in users:
        for role in user["roles"]:
            grouped_roles[role].append(user)
    #Εδω το context που επιστρέφω χρησιμευει κυριως στις for που βαζω στο dashboard.html για να επιστρέφω τα πραγματικά δεδομένα στους φακέλους.
    context = {"nodes": nodes,"users": users,
               "grouped_roles": dict(grouped_roles),
               "cluster_health": cluster_health,
               "clusters": clusters,
               "selected_cluster": selected_cluster,
               "indices": indices,
               "shards": shards,
               "node_disk_usage":node_disk_usage,
               "node_monitoring":list(node_monitoring.values()),
               "cluster_total": cluster_total,
               "cluster_used": cluster_used,
               "cluster_free": cluster_free,
               "cluster_total_display": cluster_total_display,
               "cluster_used_display": cluster_used_display,
               "cluster_free_display":cluster_free_display,
               "cluster_usage": cluster_usage,
               "primary_shards": primary_shards,
               "replica_shards": replica_shards,
               "total_shards": total_shards,
               "started_shards": started_shards,
               "relocating_shards": relocating_shards,
               "initializing_shards": initializing_shards,
               "unassigned_shards_monitoring": unassigned_shards,
               "total_shard_storage":total_shard_storage_bytes,
               "total_shard_storage_display": total_shard_storage_display,
               "snapshots": snapshots
               }

    return render(request,"dashboard.html",context)


def connect_cluster(request, cluster_id):
    clusters = get_clusters()

    for cluster in clusters:

        if cluster["id"] == cluster_id:
            selected_cluster = cluster
            break

    request.session["selected_cluster"] = selected_cluster

    return redirect("elastic_dashboard")

def disconnect_cluster(request):
    request.session.pop("selected_cluster",None)
    return redirect("elastic_dashboard")

def cluster_health_history_panel(request,cluster_name):
    cluster = request.session.get("selected_cluster")
    cluster_health = get_cluster_health(cluster)

    period = request.GET.get("period","24h")
    history = get_cluster_health_history(cluster,cluster_name,period)

    return JsonResponse({"history": history,"current_status":cluster_health["status"]})

def cluster_storage_history_panel(request,cluster_name):
    cluster = request.session.get("selected_cluster")
    period = request.GET.get("period","24h")
    
    history = get_cluster_storage_history(cluster,cluster_name,period)

    return JsonResponse({"history": history})

def node_history_panel(request,node_name):
    cluster = request.session.get("selected_cluster")
    period = request.GET.get("period","24h")

    history = get_node_history(cluster,node_name,period)

    return JsonResponse({"history": history})
