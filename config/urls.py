"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from views import elastic_dashboard,connect_cluster,disconnect_cluster,cluster_health_history_panel,cluster_storage_history_panel,node_history_panel,index_history_panel,shard_history_panel,validate_cluster,save_cluster,get_clusters_json,delete_cluster

urlpatterns = [
    path('admin/', admin.site.urls),
    path("",elastic_dashboard,name="dashboard"),
    path("validate-cluster/",validate_cluster, name="validate_cluster"),
    path("elastic_dashboard/",elastic_dashboard,name="elastic_dashboard"),
    path("connect_cluster/<str:cluster_id>/", connect_cluster, name="connect_cluster"),
    path("disconnect_cluster/",disconnect_cluster,name="disconnect_cluster"),
    path("save-cluster/",save_cluster,name="save_cluster"),
    path("get-clusters/",get_clusters_json,name="get_clusters_json"),
    path("delete-cluster/",delete_cluster,name="delete_cluster"),
    path("cluster-health-history/<str:cluster_name>/",cluster_health_history_panel),
    path("cluster-storage-history/<str:cluster_name>/",cluster_storage_history_panel),
    path("node-history/<str:node_name>/",node_history_panel),
    path("index-history/<str:index_name>/",index_history_panel),
    path("shard-history/<str:cluster_name>/",shard_history_panel)

]
