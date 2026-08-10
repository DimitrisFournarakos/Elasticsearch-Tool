# Elasticsearch Tool

A lightweight Elasticsearch Administration Platform built with Django and Elasticsearch.

Designed to provide an intuitive alternative administration interface for monitoring clusters, managing snapshots, users, nodes and Elasticsearch resources through a modern web interface.
---

## Features

### Cluster Management

- Multi-cluster support
- Cluster health monitoring
- Cluster overview dashboard
- Node monitoring
- Shard monitoring

### User Administration

- User management
- User details explorer
- Role visualization

### Index Management

- Index explorer
- Index statistics
- Index disk usage monitoring

### Snapshot Management

- Snapshot repository creation
- Snapshot browsing
- Snapshot creation
- Repository Explorer
- Snapshot property viewer

### Monitoring

- Cluster monitoring
- Node monitoring
- Shard allocation overview
- Disk usage analysis

---

## Dashboard

Access the application:

http://localhost:9000/elastic_dashboard/
---

## Screenshots

### Elasticsearch Dashboard

![docs/Dashboard/dashboard.png]

### Snapshot Management

![Snapshots](docs/screenshots/snapshots.png)  

### Cluster Monitoring

docs/screenshots/monitoring.png  

---

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
├── .env-example
├── README.md

├── deployment/
│   ├── docker-compose.yml
│   ├── docker-compose-elasticsearch.yml
│   └── elasticsearch.yml

├── config/
├── static/
├── templates/

├── elastic_monitor.py
├── elasticsearch_api.py
├── manage.py
├── views.py
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/DimitrisFournarakos/Elasticsearch-Tool.git

cd Elasticsearch-Tool
```
---

## Environment Variables

Create a `.env` file based on:

```bash
cp .env-example .env
```

Example:

```env
SECRET_KEY=CHANGE_ME
ELASTIC_PASSWORD=ChangeMe123!
MONITORING_PASSWORD=ChangeMe456!
```

---

## Docker Deployment

Build application:

```bash
docker build -t elasticsearch-tool .
```

Run application:

```bash
docker compose -f deployment/docker-compose.yml up -d
```

Open:

```text
http://localhost:9000/elastic_dashboard/
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

allowing:

- Repository Creation
- Snapshot Creation
- Snapshot Restore
- Repository Explorer


---

## Author

Dimitrios Fournarakos

GitHub:
https://github.com/DimitrisFournarakos

---

## License

MIT License