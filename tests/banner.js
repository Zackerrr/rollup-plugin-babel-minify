import chai from 'chai';
import createTransformTest from './helpers/createTransformTest.js';
import { defaultBabelOptions } from './helpers/createTransformTest.js';
import { defaultRollupOptions } from './helpers/createTransformTest.js';
import { defaultBundleOptions } from './helpers/createTransformTest.js';
import plugin from '../src/index.js';

const expect = chai.expect;

describe( 'banner and comments support', () => {
	it( 'removes comments', () => {
		return createTransformTest( {
			babelOptions: Object.assign( {}, defaultBabelOptions, {
				comments: false
			} ),
			rollupOptions: {
				plugins: [
					plugin( {
						comments: false
					} )
				]
			}
		} ).then( ( { bundle, transpiled } ) => {
			expect( bundle.code.trim() ).to.equal( transpiled.code );
		} );
	} );

	it( 'adds banner even if comments are removed', () => {
		return createTransformTest( {
			rollupOptions: {
				plugins: [
					plugin( {
						comments: false,
						banner: '/* hublabubla */'
					} )
				]
			}
		} ).then( ( { bundle } ) => {
			expect( bundle.code ).to.match( /^\/\* hublabubla \*\// );
		} );
	} );

	it( 'adds banner inherited from bundle.generate', () => {
		return createTransformTest( {
			bundleOptions: Object.assign( {}, defaultBundleOptions, {
				banner: '/* hublabubla */'
			} )
		} ).then( ( { bundle } ) => {
			expect( bundle.code ).to.match( /^\/\* hublabubla \*\// );
		} );
	} );

	it( 'adds banner inherited from root configuration', () => {
		const bannerOptions = {
			output: {
				banner: '/* hublabubla */'
			}
		};
		const rollupOptions = Object.assign( defaultRollupOptions, bannerOptions );
		const bundleOptions = Object.assign( {}, defaultBundleOptions, bannerOptions );

		return createTransformTest( {
			rollupOptions,
			bundleOptions
		} ).then( ( { bundle } ) => {
			expect( bundle.code ).to.match( /^\/\* hublabubla \*\// );
		} );
	} );

	it ( 'adds banner as a result of call if plugin banner option is fn itself', () => {
		return createTransformTest( {
			rollupOptions: {
				plugins: [
					plugin( {
						banner: () => {
							return '/* hublabubla */';
						}
					} )
				]
			}
		} ).then( ( { bundle } ) => {
			expect( bundle.code ).to.match( /^\/\* hublabubla \*\// );
		} );
	} );

	it( 'preserves comments alongside banner if no comments option is passed', () => {
		return createTransformTest( {
			rollupOptions: {
				plugins: [
					plugin( {
						banner: '/* hublabubla */'
					} )
				]
			}
		} ).then( ( { bundle } ) => {
			expect( bundle.code ).to.match( /^\/\* hublabubla \*\// );
			expect( bundle.code ).to.match( /.+\/\* Simple comment \*\/.+/g );
		} );
	} );

	it( 'preserves comments alongside banner if comments option is set to true', () => {
		return createTransformTest( {
			rollupOptions: {
				plugins: [
					plugin( {
						comments: true,
						banner: '/* hublabubla */'
					} )
				]
			}
		} ).then( ( { bundle } ) => {
			expect( bundle.code ).to.match( /^\/\* hublabubla \*\// );
			expect( bundle.code ).to.match( /.+\/\* Simple comment \*\/.+/g );
		} );
	} );

	// #16
	it( 'adds new line after banner if appropriate option is passed', () => {
		return createTransformTest( {
			rollupOptions: {
				plugins: [
					plugin( {
						banner: '/* hublabubla */',
						bannerNewLine: true
					} )
				]
			}
		} ).then( ( { bundle } ) => {
			expect( bundle.code ).to.match( /^\/\* hublabubla \*\/\n[^\n]/ );
		} );
	} );

	// #16
	it( 'does not add new line after banner if appropriate option is not passed', () => {
		return createTransformTest( {
			rollupOptions: {
				plugins: [
					plugin( {
						banner: '/* hublabubla */'
					} )
				]
			}
		} ).then( ( { bundle } ) => {
			expect( bundle.code ).to.match( /^\/\* hublabubla \*\/[^\n]/ );
		} );
	} );

	// #16
	it( 'does not add new line after banner if appropriate option is set to false', () => {
		return createTransformTest( {
			rollupOptions: {
				plugins: [
					plugin( {
						banner: '/* hublabubla */',
						bannerNewLine: false
					} )
				]
			}
		} ).then( ( { bundle } ) => {
			expect( bundle.code ).to.match( /^\/\* hublabubla \*\/[^\n]/ );
		} );
	} );

	// #138
	it ( 'works with other plugins', () => {
		return createTransformTest( {
			skipBabel: true,
			fixture: 'dynamicImport',
			rollupOptions: {
				plugins: [
					plugin( {
						plugins: [
							'@babel/plugin-syntax-dynamic-import'
						],
						banner: '/* hublabubla */'
					} )
				]
			}
		} ).then( ( { bundle } ) => {
			expect( bundle.code ).to.match( /^\/\* hublabubla \*\// );
		} );
	} );
} );
