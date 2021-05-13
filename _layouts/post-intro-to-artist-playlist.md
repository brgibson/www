---
layout: post
---

{% if page.content %}{{page.content}}{% endif %}

<hr>

<h2 class="question-heading">Tracks</h2>

<ul>
    {% for track in page.test %}<li><span class="artist-name">{{track.artist}}</span> - <span class="album-name">{{track.album}}</span> - <span class="album-name">{{track.album}}</span></li>{% endfor %}
</ul>

<hr>

<h2 class="question-heading">Playlist</h2>

<div class="musicviewer">
  <iframe src="https://embed.spotify.com/?uri=spotify:user:1213507414:playlist:{{page.playlist-id}}" allowtransparency="true"></iframe>
</div>

<!--center><img src="{{page.playlist-img}}" alt=""></center-->

{% include global/ad-responsive.html %}

