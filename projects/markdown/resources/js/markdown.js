var markdownData = "_Text taken from GitHub's markdown documentation, found at_ [Writing on GitHub](https://help.github.com/categories/writing-on-github/)\n\n# Basic writing and formatting syntax\nCreate sophisticated formatting for your prose and code on GitHub with simple syntax.\n\n### Headings\n\nTo create a heading, add one to six `#` symbols before your heading text. The number of `#` you use will determine the size of the heading.\n\n```\n# The largest heading\n## The second largest heading\n###### The smallest heading\n```\n\n# The largest Heading\n## The second largest heading\n###### The smallest heading\n\n### Styling text\n\nYou can indicate emphasis with bold, italic, or strikethrough text.\n\nStyle | Syntax | Keyboard shortcut | Example | Output\n--- | --- | --- | --- | ---\nBold | `** **` or `__ __` | command/control + b | `**This is bold text**` | **This is bold text**\nItalic | `* *` or `_ _` | command/control + i | `*This text is italicized*` | *This text is italicized*\nStrikethrough | `~~ ~~` | | `~~This was mistaken text~~` | ~~This was mistaken text~~\nBold and italic | `** **` and `_ _` | | `**This text is _extremely_ important**` | **This text is _extremely_ important**\n\n### Quoting text\n\nYou can quote text with a `>`.\n\n```\nIn the words of Abraham Lincoln:\n> Pardon my French\n```\nIn the words of Abraham Lincoln:\n> Pardon my French\n\nYou can call out code or a command within a sentence with single backticks. The text within the backticks will not be formatted.\n\n```Use `git status` to list all new or modified files that haven't yet been committed.```\n\nUse `git status` to list all new or modified files that haven't yet been committed.\n\n*Coded by [Eric Rolfe](https://freecodecamp.com/elrolfe)*";

var MarkdownPreview = React.createClass({
  getInitialState: function() {
    return {value: this.props.data};
  },
  handleChange: function() {
    this.setState({value: this.refs.inputArea.value});
  },
  processed: function() {
    return {__html: marked(this.state.value)};
  },
  render: function() {
    return (
      <div className="wrapper">
        <div className="markdown">
          <h2>Input</h2>
          <textarea
            className="markdownInput"
            ref="inputArea"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </div>
        <div className="markdown">
          <h2>Preview</h2><hr/>
          <div 
            className="markdownOutput"
            dangerouslySetInnerHTML={this.processed()}
          />
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <MarkdownPreview data={markdownData} />,
  document.getElementById("output")
);