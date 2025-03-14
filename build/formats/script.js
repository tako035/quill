import Inline from '../blots/inline';
class Script extends Inline {
    static create(value) {
        if (value === 'super') {
            return document.createElement('sup');
        }
        if (value === 'sub') {
            return document.createElement('sub');
        }
        return super.create(value);
    }
    static formats(domNode) {
        if (domNode.tagName === 'SUB')
            return 'sub';
        if (domNode.tagName === 'SUP')
            return 'super';
        return undefined;
    }
}
Script.blotName = 'script';
Script.tagName = ['SUB', 'SUP'];
export default Script;
//# sourceMappingURL=script.js.map