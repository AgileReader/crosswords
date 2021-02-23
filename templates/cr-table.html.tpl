<table>
{%- for crRow in data %}
<tr>
{%- for crElement in crRow %}

{%- set regExp = r/^[0-9]+$/g -%}

{%- if  crElement == '■' %}
<td class="forbidden"></td>
{%- elif  crElement == '' or crElement =='.' %}
<td class="empty">&nbsp;</td>
{%- elif regExp.test(crElement.toString()) %}
<td class="empty"><span>{{ crElement }}</span>&nbsp;</td>
{%- else %}
<td class="letter">{{ crElement | upper }}</td>
{%- endif -%}


{% endfor %}
</tr>

{%- endfor %}
</table>
