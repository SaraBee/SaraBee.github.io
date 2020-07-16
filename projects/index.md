---
layout: default
title: Projects
---
{% for project in site.projects %}
<div style="display:block;height:155px">
  <img src="{{project.thumbnail}}" class="left" style="margin"/>
  <h2>
    <a href="{{ project.url }}">
      {{ project.title }}
    </a>
  </h2>
  <p>{{ project.blurb }}</p>
  <br/>
</div>
{% endfor %}
