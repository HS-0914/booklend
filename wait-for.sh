# wait-for-nest.sh
#!/bin/sh


# CSV 데이터를 books 테이블에 삽입
echo $POSTGRES_PASSWORD
PGPASSWORD=$POSTGRES_PASSWORD psql -h db -U postgres -d booklend -c "\COPY books(title, author, publisher, published_year, isbn, volume, kdc) FROM '/var/lib/postgresql/books.csv' DELIMITER ',' CSV HEADER ENCODING 'UTF-8';"
echo "Data copied successfully."