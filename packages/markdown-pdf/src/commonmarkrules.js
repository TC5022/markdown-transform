/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const {
    handleFormattedText,
    getHeadingType,
} = require('./pdfmakeutil');

const rules = {};

// Inlines
rules.Emph = (visitor, thing, children, parameters) => {
    parameters.emph = true;
    parameters.result = children;
    parameters.result.forEach((child) => {
        child.italics = true;
    });
};
rules.Strong = (visitor, thing, children, parameters) => {
    parameters.strong = true;
    parameters.result = children;
    parameters.result.forEach((child) => {
        child.bold = true;
    });
};
rules.BlockQuote = (visitor, thing, children, parameters) => {
    parameters.result.stack = children;
};
rules.Item = (visitor, thing, children, parameters) => {
    parameters.result.stack = children;
};
rules.Link = (visitor, thing, children, parameters) => {
    parameters.result.text = thing.nodes[0].text;
    parameters.result.link = thing.destination;
};
rules.Image = (visitor, thing, children, parameters) => {
    parameters.result.image = thing.destination;
};
rules.Optional = (visitor, thing, children, parameters) => {
    parameters.result.stack = children;
};
rules.Conditional = (visitor, thing, children, parameters) => {
    parameters.result.stack = children;
};
rules.HtmlInline = (visitor, thing, children, parameters) => {
    parameters.result.text = thing.text;
};

// Blocks
rules.Paragraph = (visitor, thing, children, parameters) => {
    if(children[0] && children[0].style === 'Image') { // PDFMake can't render images inline
        parameters.result.stack = children;
    }
    else {
        parameters.result.text = children;
        parameters.result.margin = [0,5];
    }
};
rules.HtmlBlock = (visitor, thing, children, parameters) => {
    parameters.result.text = thing.text;
};
rules.CodeBlock = (visitor, thing, children, parameters) => {
    parameters.result.text = thing.text;
};
rules.Code = (visitor, thing, children, parameters) => {
    parameters.result.text = thing.text;
};
rules.Text = (visitor, thing, children, parameters) => {
    parameters.result = handleFormattedText(thing, parameters);
};
rules.Heading = (visitor, thing, children, parameters) => {
    parameters.result.style = getHeadingType(thing.level);
    parameters.result.text = children;
    parameters.result.tocItem = thing.nodes && thing.nodes.length > 0 ? true : false;
};
rules.ThematicBreak = (visitor, thing, children, parameters) => {
    parameters.result.text = '';
    parameters.result.pageBreak = 'after';
};
rules.Linebreak = (visitor, thing, children, parameters) => {
    parameters.result.text = '\n';
};
rules.Softbreak = (visitor, thing, children, parameters) => {
    parameters.result.text = ' ';
};
rules.ListBlock = (visitor, thing, children, parameters) => {
    parameters.result[thing.type === 'ordered' ? 'ol' : 'ul'] = children;
};
rules.List = (visitor, thing, children, parameters) => {
    parameters.result[thing.type === 'ordered' ? 'ol' : 'ul'] = children;
};
rules.Document = (visitor, thing, children, parameters) => {
    parameters.result.content = children;
};

module.exports = rules;
