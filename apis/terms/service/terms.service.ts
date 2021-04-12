import * as fs from 'graceful-fs';
import * as path from 'path';

/**
 * service: 약관 HTML 파일 로드
 * @param {string} termsName
 * @returns {any}
 */
export function loadTermsHtml(termsName: string): any {
	return new Promise(async (resolve, reject) => {
		const file: string = path.join(__dirname, '..', 'template', `${termsName}.html`);
		console.log(file)
		if (!fs.existsSync(file)) {
			return reject('Terms does not exist');
		}
		const result = fs.readFileSync(file, 'utf8');
		return resolve(result);
	});
}
