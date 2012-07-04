# -*- coding: utf-8 -*-
__author__ = 'lincank'

from django.db import models

class Todo(models.Model):
	content = models.TextField(max_length=128)
	order = models.IntegerField()
	done = models.BooleanField(default=False)

	def __unicode__(self):
		"""

		"""
		return u"Content: %s, done: %s, order %s" % (self.content, self.done, self.order)
