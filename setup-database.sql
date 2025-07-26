-- Setup database
USE dashboard;

-- Clear existing data
SET sql_safe_updates=0;
DELETE FROM student_marks;
DELETE FROM students;
DELETE FROM mentors;

-- Insert mentors
INSERT INTO mentors (name, email, phone) VALUES
('codequotient','codequotient@gmail.com','4343434'),
('Ben', 'shubham262608@example.com', '9876543210'),
('Kevin', 'alice@example.com', '5551234567'),
('Gwen', 'tom@example.com', '458989230'),
('Philips', 'philips@example.com', '2489349');

-- Insert students
INSERT INTO students (name, email, phone) VALUES
('gautam','gautam@gmail.com','8787888'),
('shubham','shubham1174.be21@chitkarauniversity.edu.in','54544545'),
('ryukendo','shubham.dev123int@gmail.com','9691819647'),
('anu','saxenaanubhav790@gmail.com','8787888'),
('shantnoo','shantnoo@gmail.com','8787888'),
('Kevin Owens','kevin@gmail.com','34343'),
('Shubham262608','shubham262608@gmail.com','4561'),
('sonam','sonamshri99@gmail.com','2323');