<html>
<head>
    <title>{{ title }}</title>
    <link rel="stylesheet" href="style.css" />
</head>
<body>

{%- for item in items %}
<div>
    {{ item }}
</div>
{%- if loop.index % 2 == 0 %}
<br class="clear" />
{%- endif -%}
{%- if loop.index % 4 == 0 %}
<p class="pagebreak"></p>
{%- endif -%}
{%- endfor %}

</body>
</html>
