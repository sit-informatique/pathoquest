import urllib.request
import re
from collections import Counter

try:
    req = urllib.request.Request('https://labokamoun.com/', headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
    
    css_links = re.findall(r'href=[\'\"](.*?\.css.*?)[\'\"]', html)
    colors = re.findall(r'#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b', html)
    
    for link in css_links:
        if link.startswith('//'): link = 'https:' + link
        elif link.startswith('/'): link = 'https://labokamoun.com' + link
        elif not link.startswith('http'): link = 'https://labokamoun.com/' + link
        
        try:
            req_c = urllib.request.Request(link, headers={'User-Agent': 'Mozilla/5.0'})
            css = urllib.request.urlopen(req_c).read().decode('utf-8', errors='ignore')
            colors.extend(re.findall(r'#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b', css))
        except:
            pass
            
    c = Counter([clr.lower() for clr in colors])
    for color, count in c.most_common(20):
        print(f"#{color}: {count}")
except Exception as e:
    print('Error:', e)
