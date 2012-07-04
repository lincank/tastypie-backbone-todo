from django.conf.urls.defaults import patterns, include, url
from todo_list.api import TodoResoure
# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

todo_resource = TodoResoure()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'django_backbone_todo.views.home', name='home'),
    # url(r'^django_backbone_todo/', include('django_backbone_todo.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
	url(r'^$', 'django_backbone_todo.todo_list.views.home', name='home'),
	url(r'^api/', include(todo_resource.urls)),
)
