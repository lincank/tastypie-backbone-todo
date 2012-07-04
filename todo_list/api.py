__author__ = 'lincank'

from tastypie.resources import ModelResource
from todo_list.models import Todo
from tastypie.authentication import Authentication
from tastypie.authorization import Authorization

class TodoResoure(ModelResource):
	class Meta:
		queryset = Todo.objects.all()
		resource_name = 'todo'

		# IMPORTANT: no-op authentication and authorization here just for demo purpose
		# NEVER use in this way in production
		authentication = Authentication()
		authorization = Authorization()