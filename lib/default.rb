module PostHelper
  def get_pretty_date(post)
    attribute_to_time(post[:created_at]).strftime('%d.%m.%Y')
  end
end

def get_post_start(post)
  if post[:description]
    content = post[:description]
  else
    content = post.compiled_content
    if content =~ /\n/
      content = content.partition("\n").first
    end
  end
  return content
end

# @return [Array]
def menu(name)
      blk = -> { @items.select { |item| item[:menu] == name }.sort_by{ |item| item[:menuprio].to_i}.reverse} 
      blk.call
end





include PostHelper