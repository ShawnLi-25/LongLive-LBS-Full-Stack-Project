const assert = require('assert');

const helper = require('./helper');

it('just try', () => {
    assert.equal(helper.getTimeFields().length, 6)
});