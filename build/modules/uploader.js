import Delta from 'quill-delta';
import Emitter from '../core/emitter';
import Module from '../core/module';
class Uploader extends Module {
    constructor(quill, options) {
        super(quill, options);
        quill.root.addEventListener('drop', (e) => {
            var _a;
            e.preventDefault();
            let native = null;
            if (document.caretRangeFromPoint) {
                native = document.caretRangeFromPoint(e.clientX, e.clientY);
                // @ts-expect-error
            }
            else if (document.caretPositionFromPoint) {
                // @ts-expect-error
                const position = document.caretPositionFromPoint(e.clientX, e.clientY);
                native = document.createRange();
                native.setStart(position.offsetNode, position.offset);
                native.setEnd(position.offsetNode, position.offset);
            }
            const normalized = native && quill.selection.normalizeNative(native);
            if (normalized) {
                const range = quill.selection.normalizedToRange(normalized);
                if ((_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.files) {
                    this.upload(range, e.dataTransfer.files);
                }
            }
        });
    }
    upload(range, files) {
        const uploads = [];
        Array.from(files).forEach((file) => {
            var _a;
            if (file && ((_a = this.options.mimetypes) === null || _a === void 0 ? void 0 : _a.includes(file.type))) {
                uploads.push(file);
            }
        });
        if (uploads.length > 0) {
            // @ts-expect-error Fix me later
            this.options.handler.call(this, range, uploads);
        }
    }
}
Uploader.DEFAULTS = {
    mimetypes: ['image/png', 'image/jpeg'],
    handler(range, files) {
        const promises = files.map((file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    // @ts-expect-error Fix me later
                    resolve(e.target.result);
                };
                reader.readAsDataURL(file);
            });
        });
        Promise.all(promises).then((images) => {
            const update = images.reduce((delta, image) => {
                return delta.insert({ image });
            }, new Delta().retain(range.index).delete(range.length));
            this.quill.updateContents(update, Emitter.sources.USER);
            this.quill.setSelection(range.index + images.length, Emitter.sources.SILENT);
        });
    },
};
export default Uploader;
//# sourceMappingURL=uploader.js.map