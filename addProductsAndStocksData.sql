create table products (
	id uuid primary key default uuid_generate_v4(),
    title text not null, 
    description text,
    price integer,
    "imageUrl" text
);

create table stocks (  
    count integer, 
    product_id uuid,
    foreign key ("product_id") references "products" ("id")
);

insert into products 
	(title, description, price, "imageUrl") 
values 
	('Intel CPU', 'Short Product Description1', 300, 'https://images.unsplash.com/photo-1540829917886-91ab031b1764?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aW50ZWx8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'),
	('AMD CPU', 'Short Product Description3', 250, 'https://images.unsplash.com/photo-1568209865332-a15790aed756?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YW1kfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'),
	('Motherboard', 'Short Product Description2', 170, 'https://images.unsplash.com/photo-1522920192563-6df902920a8a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YXN1cyUyMG1vdGhlcmJvYXJkfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'),
	('RAM', 'Short Product Description7', 100, 'https://images.unsplash.com/photo-1562976540-1502c2145186?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmFtfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60'),
	('SSD', 'Short Product Description2', 100, 'https://images.unsplash.com/photo-1615293889204-6db03c596147?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8c3NkfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'),
	('Videocard', 'Short Product Description4', 1000, 'https://media.istockphoto.com/photos/graphic-card-picture-id185249594?b=1&k=20&m=185249594&s=170667a&w=0&h=WS7GN92b8zbyod8sOUdjk_ZlN9kgPls0MnjrGb4K708='),
	('Mouse', 'Short Product Descriptio1', 50, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8bW91c2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'),
	('Keyboard', 'Short Product Description7', 40, 'https://images.unsplash.com/photo-1584727129739-cd30984745bc?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8a2V5Ym9hcmQlMjBhbmQlMjBtb3VzZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60');

insert into stocks 
	(product_id, count)
values
	((select id from products where products.title = 'Intel CPU' ), 10),
	((select id from products where products.title = 'AMD CPU' ), 15),
	((select id from products where products.title = 'Motherboard' ), 20),
	((select id from products where products.title = 'RAM' ), 40),
	((select id from products where products.title = 'SSD' ), 50),
	((select id from products where products.title = 'Videocard' ), 2),
	((select id from products where products.title = 'Mouse' ), 70),
	((select id from products where products.title ='Keyboard' ), 80);

--drop table stocks
--drop table products
 
create extension if not exists 'uuid-ossp';