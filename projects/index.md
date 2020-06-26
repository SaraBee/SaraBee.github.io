---
layout: default
title: Projects
---
{% for project in site.projects %}
  <h2>
    <a href="{{ project.url }}">
      {{ project.title }}
    </a>
  </h2>
  <img src="{{ project.image }}" width="500"/>
  <p>{{ project.blurb }}</p>
  <br/>
{% endfor %}
