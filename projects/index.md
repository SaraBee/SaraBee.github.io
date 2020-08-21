---
layout: default
title: Projects
---
{% assign ordered-projects = site.projects | sort: "priority" %}
{% for project in ordered-projects %}
<div style="display:block;height:155px">
  <a href="{{ project.url }}"><img src="{{project.thumbnail}}" class="left thumbnail"/></a>
  <h2>
    <a href="{{ project.url }}">{{ project.title }}</a>
  </h2>
  <p>{{ project.blurb }}</p>
  <br/>
</div>
{% endfor %}
