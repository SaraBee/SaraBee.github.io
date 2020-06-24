---
layout: default
title: Projects
---
{% for project in site.projects %}
  <img src="{{ project.image }}" width="500"/>
  <h2>
    <a href="{{ project.url }}">
      {{ project.title }}
    </a>
  </h2>
  <p>{{ project.blurb }}</p>
{% endfor %}
