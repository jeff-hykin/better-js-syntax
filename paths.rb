require 'json'
require 'yaml'
require 'fileutils'
require 'pathname'

PathFor = {
    root: __dir__,
    syntax:                 File.join(__dir__, "autogenerated"    , "js.tmLanguage.json" ),
    generate_macro_bailout: File.join(__dir__, "main"             , "generate_macro_bailout.js"                ),
    textmate_tools:         File.join(__dir__, "main"             , "textmate_tools.rb"                        ),
    linter:                 File.join(__dir__, "lint"             , "index.js"                                 ),
    fixtures:               File.join(__dir__, "language_examples",                                            ),
    
    pattern:                ->(pattern_file) { File.join(__dir__, "main", "patterns", pattern_file) },
}