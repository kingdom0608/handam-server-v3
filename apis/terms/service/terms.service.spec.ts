import { expect } from 'chai';
import { loadTermsHtml } from './terms.service';

describe('load terms', function() {
	it('should load term template', async () => {
		const result = await loadTermsHtml('marketingTerms');
		expect(result).to.be.a('string');
	});
})
