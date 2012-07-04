# -*- coding: utf-8 -*-
__author__ = 'lincank'

from django.http import HttpResponse
from django.shortcuts import render_to_response, get_object_or_404

def home(request):
	return render_to_response('index.html', {})