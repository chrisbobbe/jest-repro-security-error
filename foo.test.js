/** @jest-environment jest-environment-jsdom-global */

// With this line, I get this output:
//
//   FAIL  ./sum.test.js
//   ● Test suite failed to run
//  
//     SecurityError: localStorage is not available for opaque origins
//
jsdom.reconfigure({ url: 'file:///something' });
// …Without it, the test passes.
//
// The problem is that jest-runtime, at line
//   https://github.com/facebook/jest/blob/3390ec4ef6a1b93afa816655f5c1f0605066b15a/packages/jest-runtime/src/index.ts#L1165
// , is inadvertently calling jsdom's `get localStorage`:
//   https://github.com/jsdom/jsdom/blob/4c7eed155e421c3b261667b6312d4c89d2a74c1b/lib/jsdom/browser/Window.js#L417-L426
// , which throws that SecurityError when the window's location has an
// opaque origin. "file:///something" is an example of a URL with an opaque
// origin:
//   https://html.spec.whatwg.org/multipage/origin.html#concept-origin-opaque
//
// I can make the error go away by changing that code in jest-runtime such
// that `envGlobal[key]` doesn't run if `key` equals "localStorage". Once I
// do that, and the same for if `key` is "sessionStorage", the test runs and
// passes.

test('true is true', () => {
    expect(true).toBe(true);
});
