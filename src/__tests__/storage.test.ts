import { window } from '../../src/utils/globals'
import {
    resetSessionStorageSupported,
    seekFirstNonPublicSubDomain,
    resetSubDomainCache,
    sessionStore,
} from '../storage'

describe('sessionStore', () => {
    describe('seekFirstNonPublicSubDomain', () => {
        beforeEach(() => {
            resetSubDomainCache()
        })
        const mockDocumentDotCookie = {
            value_: '',

            get cookie() {
                return this.value_
            },

            set cookie(value) {
                //needs to refuse known public suffixes, like a browser would
                // value arrives like dmn_chk_1699961248575=1;domain=.uk
                const domain = value.split('domain=')
                if (['.uk', '.com', '.au', '.com.au', '.co.uk'].includes(domain[1])) return
                this.value_ += value + ';'
            },
        }
        test.each([
            {
                candidate: 'www.google.co.uk',
                expected: 'google.co.uk',
            },
            {
                candidate: 'www.google.com',
                expected: 'google.com',
            },
            {
                candidate: 'www.google.com.au',
                expected: 'google.com.au',
            },
            {
                candidate: 'localhost',
                expected: '',
            },
        ])(`%s subdomain check`, ({ candidate, expected }) => {
            expect(seekFirstNonPublicSubDomain(candidate, mockDocumentDotCookie as unknown as Document)).toEqual(
                expected
            )
        })
    })

    it('stores objects as strings', () => {
        sessionStore._set('foo', { bar: 'baz' })
        expect(sessionStore._get('foo')).toEqual('{"bar":"baz"}')
    })
    it('stores and retrieves an object untouched', () => {
        const obj = { bar: 'baz' }
        sessionStore._set('foo', obj)
        expect(sessionStore._parse('foo')).toEqual(obj)
    })
    it('stores and retrieves a string untouched', () => {
        const str = 'hey hey'
        sessionStore._set('foo', str)
        expect(sessionStore._parse('foo')).toEqual(str)
    })
    it('returns null if the key does not exist', () => {
        expect(sessionStore._parse('baz')).toEqual(null)
    })
    it('remove deletes an item from storage', () => {
        const str = 'hey hey'
        sessionStore._set('foo', str)
        expect(sessionStore._parse('foo')).toEqual(str)
        sessionStore._remove('foo')
        expect(sessionStore._parse('foo')).toEqual(null)
    })

    describe('sessionStore._is_supported', () => {
        beforeEach(() => {
            // Reset the sessionStorageSupported before each test. Otherwise, we'd just be testing the cached value.
            // eslint-disable-next-line no-unused-vars
            resetSessionStorageSupported()
        })
        it('returns false if sessionStorage is undefined', () => {
            const sessionStorage = (window as any).sessionStorage
            delete (window as any).sessionStorage
            expect(sessionStore._is_supported()).toEqual(false)
            ;(window as any).sessionStorage = sessionStorage
        })
        it('returns true by default', () => {
            expect(sessionStore._is_supported()).toEqual(true)
        })
    })
})
