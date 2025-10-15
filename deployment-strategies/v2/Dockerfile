FROM httpd:alpine3.22

COPY index.html /usr/local/apache2/htdocs/

EXPOSE 80

CMD ["httpd", "-D", "FOREGROUND"]