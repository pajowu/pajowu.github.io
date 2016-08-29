include Nanoc::Helpers::Blogging
module ItemHelper

  def index_item
    @items.select { |item| item.identifier.without_ext == "/index" }[0]
  end

  def footer_item
    @items.select { |item| item.identifier.without_ext == "/footer" }[0]
  end

  def newest_article
  	sorted_articles[0]
    #@items.select { |item| item[:kind] == "article" }[0]
  end
end

include ItemHelper