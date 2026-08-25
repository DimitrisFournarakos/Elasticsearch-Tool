# Elasticsearch Tool

A lightweight Elasticsearch Administration Platform built with Django and Elasticsearch.

Designed to provide an intuitive alternative administration interface for monitoring clusters, managing snapshots, users, nodes and Elasticsearch resources through a modern web interface.
---

## Features

### Cluster Management

- Multi-cluster support
- Cluster connection management
- Cluster creation and deletion
- Encrypted cluster credentials
- Cluster information dashboard

### Historical Monitoring

- Cluster Health History
- Cluster Growth History
- Node Growth History
- Index Growth History
- Shard Growth History
- Trend analysis
- Availability metrics
- Historical event tracking

### User Administration

- User details explorer
- Role visualization
- Role-based user browsing

### Node Monitoring

- Node monitoring
- Node disk usage analysis
- Node growth history

### Index Management

- Index explorer
- Index statistics
- Index disk usage monitoring
- Index growth history
- Document growth tracking
- Storage growth analysis

### Shard Monitoring

- Shard allocation overview
- Shard health monitoring
- Shard growth history
- Shard storage analysis

### Snapshot Management

- Snapshot repository explorer
- Snapshot browsing
- Snapshot property viewer
- Repository overview

### Security

- Encrypted cluster credentials storage
- Automatic password encryption
- Automatic password decryption
- Environment-based cluster configuration
---

## Elasticsearch-Tool Interface

Access the application:

http://localhost:9000
---

## Screenshots

### Multi-cluster Support

![Multi-clusters](docs/screenshots/multi-cluster-support.png)

### Users Management

![Users Management](docs/screenshots/users-management-1.png)
![Users Management](docs/screenshots/users-management-2.png)

### Health Management
![Cluster Health Monitoring](docs/screenshots/cluster-health-monitoring.png)
![Cluster Health Dashboard](docs/screenshots/dashboard-cluster-health.png)

### Snapshots Management
![Snapshot Management](docs/screenshots/snapshot-management.png)

### Cluster Monitoring

![Cluster Monitoring](docs/screenshots/cluster-monitoring.png)
![Cluster Monitoring](docs/screenshots/cluster-growth-history.png)

### Node Monitoring
![Node Monitoring](docs/screenshots/node-monitoring.png)
![Node Monitoring](docs/screenshots/node-growth-history.png)

### Index Monitoring
![Index Monitoring](docs/screenshots/index-monitoring.png)
![Index Monitoring](docs/screenshots/index-growth-history-1.png)
![Index Monitoring](docs/screenshots/index-growth-history-2.png)

#### Shard Monitoring
![Shard Monitoring](docs/screenshots/shard-monitoring.png)
![Shard Monitoring](docs/screenshots/shard-growth-history-1.png)
![Shard Monitoring](docs/screenshots/shard-growth-history-2.png)
---

## Monitoring Architecture

Elasticsearch Tool includes built-in historical monitoring capabilities.

The application automatically creates hidden Elasticsearch indices to store monitoring data:

```text
.cluster-health-history
.cluster-storage-history
.cluster-node-history
.cluster-index-history
.cluster-shard-history
```

### Historical Dashboards

- Cluster Health History
- Cluster Growth History
- Node Growth History
- Index Growth History
- Shard Growth History

### Monitoring Capabilities

- Automatic historical data collection
- Trend analysis
- Availability tracking
- Growth monitoring
- Recent event tracking
- Interactive charts
- Native Elasticsearch storage

### Stored Information

Depending on the monitoring type, historical records may include:

```json
{
  "cluster": "elastic-cluster",
  "timestamp": "2026-08-11T10:52:18Z"
}
```

Examples of stored metrics:

- Health status changes
- Storage usage history
- Node disk usage history
- Index growth statistics
- Shard allocation events


### Benefits

- Fully automated setup
- No external database required
- Native Elasticsearch storage
- Hidden monitoring indices
- Historical trend analysis
- Growth monitoring
- Scalable for large Elasticsearch environments

## Technology Stack

- Django
- Elasticsearch
- Python
- Docker
- Docker Compose
- HTML
- CSS
- JavaScript

---

## Project Structure

```text
elastic_monitor/

├── Dockerfile
├── requirements.txt
├── README.md
├── LICENSE
├── .gitignore
├── .env-example

├── config/

├── deployment/
│   ├── docker-compose.yml
│   ├── docker-compose-elasticsearch.yml
│   └── elasticsearch.yml

├── docs/
│   └── screenshots/

├── static/
├── templates/

├── elastic_monitor.py
├── elasticsearch_api.py
├── encryption_utils.py
├── views.py
├── manage.py
```

### Runtime Generated Files

The following files are created automatically during runtime and are not included in the repository:

```text
clusters.json
users.json
db.sqlite3
.env
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/DimitrisFournarakos/Elasticsearch-Tool.git

cd Elasticsearch-Tool
```
---

### Environment Variables

Create a `.env` file based on:

```bash
cp .env-example .env
```

Example:

```env
# Django

SECRET_KEY=CHANGE_ME

# Cluster Credential Encryption

CLUSTER_ENCRYPTION_KEY=GENERATE_ENCRYPTION_KEY
### Generate Encryption Key

```python
from cryptography.fernet import Fernet

print(Fernet.generate_key().decode())
```

Copy the generated key into:

```env
CLUSTER_ENCRYPTION_KEY=...
```
# Demo Elasticsearch Environment Only

ELASTIC_PASSWORD=CHANGE_ME
MONITORING_PASSWORD=CHANGE_ME
```

**Note:**

`ELASTIC_PASSWORD` and `MONITORING_PASSWORD` are only required when using the included demo Elasticsearch environment (`docker-compose-elasticsearch.yml`).

Cluster credentials added through the web interface are stored separately in `clusters.json` and are automatically encrypted using `CLUSTER_ENCRYPTION_KEY`.

---
### Cluster Credential Encryption

Cluster credentials stored in `clusters.json` are automatically encrypted using Fernet encryption.

The encryption key is defined in:

```env
CLUSTER_ENCRYPTION_KEY=GENERATE_ENCRYPTION_KEY
```

Passwords are encrypted during cluster creation and automatically decrypted when establishing Elasticsearch connections.

No manual encryption or decryption steps are required.

---
### Cluster Configuration

Clusters can be added directly from the web interface using the Add Cluster panel.

The application automatically creates and manages the required `clusters.json` file if it does not already exist.

Example:

```json
{
  "clusters": [
    {
  "id": "prod",
  "name": "elastic-cluster",
  "url": "http://localhost:9200",
  "username": "elastic",
  "password": "gAAAAAB...",
  "environment": "production"
  }
  ]
}
```

### Field Description

| Field | Description |
|---------|---------|
| id | Unique cluster identifier |
| name | Cluster display name |
| url | Elasticsearch endpoint URL |
| username | Elasticsearch username |
| password | Elasticsearch password (encrypted) |
| environment | Environment type (production, monitoring, development, etc.) |

## Docker Deployment

Build application:

```bash
docker build -t elasticsearch-tool .
```

Run application:

```bash
docker-compose -f deployment/docker-compose.yml up -d
```

Open:

```text
http://localhost:9000
```

---

## Elasticsearch Demo Environment

Start demo Elasticsearch clusters:

```bash
docker compose -f deployment/docker-compose-elasticsearch.yml up -d
```

This deploys:

- elastic-cluster
- monitoring-cluster

with snapshot repository support enabled.

---

## Snapshot Repository Support

The demo environment includes:

```yaml
path.repo:
  - /usr/share/elasticsearch/snapshots
```

providing:

- Snapshot repository browsing
- Snapshot inspection
- Repository overview
- Snapshot property exploration

## Author

Dimitrios Fournarakos

GitHub:
https://github.com/DimitrisFournarakos

---

## License

Copyright © 2026 Dimitrios Fournarakos.

This software is distributed under a Commercial Source Code License.

See the LICENSE file for complete licensing terms.
