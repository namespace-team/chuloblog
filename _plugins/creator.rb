require 'dotenv/load'
require 'trello'
require 'pry'
require 'httparty'

module Jekyll
  class ContentCreatorGenerator<Generator
    safe true
    ACCEPTED_COLOR="green"

    def setup
      @trello_api_key=ENV['TRELLO_API_KEY']
      @trello_token=ENV['TRELLO_TOKEN']
      @author = ""
      @username = ""
      Trello.configure do |config|
        config.developer_public_key=@trello_api_key
        config.member_token=@trello_token
      end
    end


    def get_card_actions(card_id)
      actions = HTTParty.get("https://api.trello.com/1/cards/#{card_id}/actions?key=#{@trello_api_key}&token=#{@trello_token}")
      return actions.length()> 0 ? actions.last["memberCreator"] : nil
    end


    def generate(site)
      # binding.pry
      setup
      cards=Trello::List.find("6269179f7ef3636d23358bba").cards
      cards.each do |card|
        card_id = card.short_url.split("c/")[1]
        actions = get_card_actions(card_id)
        # binding.pry

        actions ? @author = actions["fullName"] : @uthor
        actions ? @username = actions["username"] : @username

# binding.pry
        labels=card.labels.map{|label| label.color}
        # binding.pry

        # tags = card.labels[labels.find_index("sky")].name
        blog_tags = card.labels.reject{|c| c.color == "green"}
        due_on=card.due&.to_date.to_s
        slug=card.name.split.join("-").downcase
        created_on=DateTime.strptime(card.id[0..7].to_i(16).to_s,'%s').to_date.to_s
        article_date=due_on.empty? ? created_on : due_on
        firstname = @author.split(" ")[0]
        content="""---
layout: pages
title: #{card.name}
date: #{article_date}
author: #{@username}
tag: #{blog_tags.first.name}
fullname: #{@author}
---

#{card.desc}
        """
        file=File.open("./_posts/#{article_date}-#{slug}.md","w+"){|f| f.write(content)}
        author_content = """---
layout: authors
short_name: #{@username}
fullname: #{@author}
name: #{firstname}
---
"""
      unless File.file?("./_authors/#{firstname}.md")
        File.open("./_authors/#{firstname}.md", "w+") {|f| f.write(author_content) }
      end

      blog_tags.each do |tag|
        tag_label = tag.name
        tag_content = """---
layout: tags
tag: #{tag_label}
---
"""     
        Dir.mkdir("./tags/#{tag_label}") unless Dir.exist?("./tags/#{tag_label}")
        unless File.file?("./tags/#{tag_label}/index.md")
          File.open("./tags/#{tag_label}/index.md", "w+") {|f| f.write(tag_content) }
        end
      end
      end
    end
  end
end