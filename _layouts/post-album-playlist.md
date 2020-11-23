---
layout: post
---

{% if page.content %}{{page.content}}{% endif %}

<h2 class="question-heading">Albums</h2>

<ul>
    {% for album in page.albums %}<li>{{album}}</li>{% endfor %}
</ul>

<h2 class="question-heading">Playlist</h2>

<div class="musicviewer">
  <iframe src="https://embed.spotify.com/?uri=spotify:user:1213507414:playlist:{{page.playlist-id}}" allowtransparency="true"></iframe>
</div>

<!--center><img src="{{page.playlist-img}}" alt=""></center-->

{% include global/ad-responsive.html %}

