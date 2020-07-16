---
layout: default
title: Projects
---
{% for project in site.projects %}
<div style="display:block;height:155px">
  <img src="{{project.thumbnail}}" class="left" style="opacity:0.5"/>
  <h2>
    <a href="{{ project.url }}">
      {{ project.title }}
    </a>
  </h2>
  <p>{{ project.blurb }}</p>
  <br/>
</div>
{% endfor %}
