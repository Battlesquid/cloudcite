import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        citations: new Map(),
        editing: {author: {firstName: "", middleName: "", lastName: ""}}
    },
    mutations: {
        setCitation(state, payload) {
            state.citations.set(payload.url, payload)
        },
        setEditingCitationAuthor(state, payload) {
            switch (payload.field) {
                case 'firstName':
                  state.editing.authors[payload.authorsIndex].firstName = payload.event;
                  break;
                case 'middleName':
                  state.editing.authors[payload.authorsIndex].middleName = payload.event;
                  break;
                case 'lastName':
                  state.editing.authors[payload.authorsIndex].lastName = payload.event;
                  break;
                default:
                  console.log('Invalid author field')
            }
        },
        setCitations(state, payload) {
            state.citations = payload
        },
        setEditing(state, payload) {
            state.editing = payload
        },
        addNewEditingAuthor(state) {
            state.editing.authors.push({
                firstName: '',
                middleName: '',
                lastName: ''
            })
        },
        removeEditingAuthor(state, payload) {
            state.editing.authors = state.editing.authors.filter(element => element !== payload.element);
        }
    },
    actions: {
        setCitation(context, payload) {
            context.commit('setCitation', payload)
        },
        setEditingCitationAuthor(context, payload) {
            context.commit('setEditingCitationAuthor', payload)
        },
        setCitations(context, payload) {
            context.commit('setCitations', payload)
        },
        setEditing(context, payload) {
            context.commit('setEditing', payload)
        },
        addNewEditingAuthor(context) {
            context.commit('addNewEditingAuthor')
        },
        removeEditingAuthor(context, payload) {
            context.commit('removeEditingAuthor', payload)
        }
    },
    getters: {
        getCitations(state) {
            return state.citations
        },
        getCitation: (state) => (url) => {
            const citation = state.citations.get(url)
            if (!citation) {
                return -1;
            } else {
                return citation;
            }
        },
        getEditing(state) {
            if (!state.editing) {
                return -1;
            } else {
                return state.editing
            }
        }
    }
})