---
layout: default
title: News
permalink: /news/
---
{% for post in site.posts %}
### {{ post.date | date_to_string }}
##[{{ post.description }}]({{ post.url }})
{{ post.excerpt }}
{% endfor %}


