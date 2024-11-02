# frozen_string_literal: true
require 'ruby_grammar_builder'
require 'walk_up'
require_relative walk_up_until("paths.rb")
require_relative './tokens.rb'

# 
# 
# create grammar!
# 
# 
grammar = Grammar.fromTmLanguage(File.join(__dir__, "modified.tmLanguage.json"))

# 
#
# Setup Grammar
#
# 
    grammar[:$initial_context] = [
        :self,
    ]

# 
# Helpers
# 
    # @space
    # @spaces
    # @digit
    # @digits
    # @standard_character
    # @word
    # @word_boundary
    # @white_space_start_boundary
    # @white_space_end_boundary
    # @start_of_document
    # @end_of_document
    # @start_of_line
    # @end_of_line
    part_of_a_variable = /[a-zA-Z_][a-zA-Z_0-9]*/
    # this is really useful for keywords. eg: variableBounds[/new/] wont match "newThing" or "thingnew"
    variableBounds = ->(regex_pattern) do
        lookBehindToAvoid(@standard_character).then(regex_pattern).lookAheadToAvoid(@standard_character)
    end
    variable = variableBounds[part_of_a_variable]
    
# 
# basic patterns
# 
    def specialTemplate(keyword, source)
        PatternRange.new(
            tag_as: source,
            start_pattern: Pattern.new(
                    zeroOrMoreOf(match: @space, dont_back_track?: true).then(
                        lookBehindToAvoid(@standard_character)
                    ).then(
                        match: /#{keyword}/,
                        tag_as: "markup.inline.raw.#{keyword}",
                    ).zeroOrMoreOf(match: @space, dont_back_track?: true).then(
                        match: /`/,
                        tag_as: "punctuation.definition.string.template markup.inline.raw.#{keyword}.string"
                    ),
                ),
            end_pattern: Pattern.new(
                    match: /`/,
                    tag_as: "punctuation.definition.string.template markup.inline.raw.#{keyword}.string"
                ),
            includes: [
                :'template-substitution-element',
                :'string-character-escape',
                source,
            ],
        )
    end
    
    grammar[:string] = [
        :'qstring-single',
        :'qstring-double',
        specialTemplate("html", "text.html.basic#template-html"),
        specialTemplate("css", "source.css"),
        :'template',
    ]
    
#
# Save
#
name = "js"
grammar.save_to(
    syntax_name: name,
    syntax_dir: "./autogenerated",
    tag_dir: "./autogenerated",
)