using System;

namespace reuseRepo
{
    /// <summary>
    /// A text article object that inherits from Article and hold text memo.
    /// </summary>
    /// <remarks>
    /// Part of /Diagram/Article.drawio project
    /// </remarks>
    public class TextArticle : Article
    {

        /// <summary>
        /// Stores the text memo property of an article
        /// </summary>
        private string memo = "";

        /// <summary>
        /// The class constructor
        /// </summary>
        /// <param name="title"> Initial title of the article</param>
        /// <param name="author"> Initial author of the article</param>
        /// <param name="tags"> Initial array of tags of the article</param>
        /// <param name="memo"> Initial text memo of the article</param>
        public TextArticle(string title, string author, Tag[] tags, string memo) : base(title, author, tags)
        {
            this.memo = memo;
        }

        public void print()
        {
            Console.WriteLine(memo);
        }

    }
}
