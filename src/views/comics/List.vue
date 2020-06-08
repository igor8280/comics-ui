<template>
	<layout-main>
		<template v-slot:title>
			Comics Management
		</template>
		<div class="section">
			<div class="level">
				<div class="level-left columns">
					<div class="column">
						<b-field label="Trazenje po nazivu">
							<b-input class="fixed-width-250" v-model="parametri.naziv" v-on:keypress.enter.native="getComics"></b-input>
						</b-field>
					</div>
					<div class="column">
						<b-field label="Izdavac">
							<b-select class="fixed-width-250" placeholder="Izaberi izdavaca" v-model="filter.izdavac" v-on:change.native="getComics">
								<option :value="null">Reset</option>
								<option
									v-for="izdavac in izdavaci"
									:value="izdavac"
									:key="izdavac">
									{{ izdavac }}
								</option>
							</b-select>
						</b-field>
					</div>
					<div class="column">
						<b-field label="Edicija">
							<b-select class="fixed-width-250" placeholder="Izaberi ediciju" v-model="filter.edicija" v-on:change.native="getComics">
								<option :value="null">Reset</option>
								<option
									v-for="edicija in edicije"
									:value="edicija"
									:key="edicija">
									{{ edicija}}
								</option>
							</b-select>
						</b-field>
					</div>
					<div class="column">
						<b-field label="Scenarista">
							<b-select class="fixed-width-250" placeholder="Izaberi scenaristu" v-model="filter.scenario" v-on:change.native="getComics">
								<option :value="null">Reset</option>
								<option
									v-for="scenarista in scenaristi"
									:value="scenarista"
									:key="scenarista">
									{{ scenarista}}
								</option>
							</b-select>
						</b-field>
					</div>
					<div class="column">
						<b-field label="Crtez">
							<b-select class="fixed-width-250" placeholder="Izaberi crtaca" v-model="filter.crtez" v-on:change.native="getComics">
								<option :value="null">Reset</option>
								<option
									v-for="crtez in crtezi"
									:value="crtez"
									:key="crtez">
									{{ crtez}}
								</option>
							</b-select>
						</b-field>
					</div>
				</div>
				<div class="level-right">
					<b-button class="custom-btn" v-if="showCollectionItems" type="is-info" size="is-small" @click="showAllComics">Svi stripovi</b-button>
					<b-button class="custom-btn" v-if="showCollectionItems" type="is-warning" size="is-small" @click="resetFilter">Reset filter</b-button>
					<b-button class="custom-btn" v-else type="is-info" size="is-small" @click="showCollection">Moja kolekcija</b-button>
					<b-button class="custom-btn" v-if="user.access==='RW'" type="is-success" size="is-small" icon-right="plus" @click="$router.push('/comics/character/' + $route.params.char + '/create')">Dodaj</b-button>
				</div>
			</div>
			<b-table :data="data"
					backend-sorting
					:default-sort="$utils.tableSort(sortBy)"
					@sort="(field, order) => $utils.changeSort(field, order, getComics)"
					:loading="loading"
					bordered narrowed striped>
				<template slot-scope="props">
					<b-table-column field="lik" label="Karakter" width="100">
						<img src="https://via.placeholder.com/75x75" alt="">
					</b-table-column>
					<b-table-column field="naziv" label="Naziv" sortable>
						{{props.row.naziv}}
					</b-table-column>
					<b-table-column field="edicija" label="Edicija" width="200" sortable>
						{{props.row.edicija}}
					</b-table-column>
					<b-table-column field="izdavac" label="Izdavac" width="200" sortable>
						{{props.row.izdavac}}
					</b-table-column>
					<b-table-column field="scenario" label="Scenario" width="200" sortable>
						{{props.row.scenario}}
					</b-table-column>
					<b-table-column field="crtez" label="Crtez" width="200" sortable>
						{{props.row.crtez}}
					</b-table-column>
					<b-table-column field="boja" label="Boja" width="150" sortable>
						{{props.row.boja}}
					</b-table-column>
					<b-table-column field="godina" label="Godina" width="50" sortable>
						{{props.row.godina}}
					</b-table-column>
					<b-table-column field="mesec" label="Mesec" width="50" sortable>
						{{props.row.mesec}}
					</b-table-column>
					<b-table-column field="no" label="Broj" width="50" sortable>
						{{props.row.no}}
					</b-table-column>
					<b-table-column width="120" centered label="Actions">
						<div v-if="!showCollectionItems" class="buttons">
							<b-button type="is-success" size="is-small" icon-right="plus" @click="addToCollection(props.row._id)" title="Dodaj u kolekciju"/>
							<b-button v-if="user.access==='RW'" type="is-warning" size="is-small" icon-right="edit" @click="$router.push('/comics/character/' + $route.params.char + '/' + props.row._id)" title="Izmena"/>
							<b-button v-if="user.access==='RW'" type="is-danger" size="is-small" icon-right="trash" @click="remove(props.row)" title="Brisanje"/>
						</div>
						<div v-else class="buttons">
							<b-button type="is-danger" size="is-small" icon-right="trash" @click="removeFromCollection(props.row)" title="Brisanje iz kolekcije"/>
						</div>
					</b-table-column>
				</template>
			</b-table>
			<pagination v-if="!showCollectionItems" v-model="pagination" @input="getComics" rounded="isRounded" order="centered" size="is-medium" ref="pagination"/>
		</div>
	</layout-main>
</template>

<script>
export default {
	name: 'comics-char',
	data() {
		return {
			data: [],
			collectionData: [],
			izdavaci: [],
			edicije: [],
			scenaristi: [],
			crtezi: [],
			char: this.$route.params.char,
			pagination: this.$utils.defaultPagination(),
			collectionId: null,
			showCollectionItems: false,
			sortBy: 'naziv',
			loading: false,
			user: JSON.parse(this.$store.getters.user).user,
			parametri: {
				naziv: null
			},
			filter: {
				izdavac: null,
				edicija: null,
				scenario: null,
				crtez: null
			}
		};
	},
	mounted() {
		// load previous component state if exist
		// this.$utils.autoLoad();

		// collect data for table
		Promise.all([this.getComics(), this.getLists(), this.getCollection()]);
	},
	methods: {
		async getComics() {
			// show loading spinner
			this.loading = true;

			// get parameters for get request
			let params = this.$utils.getParams();
			params.char = this.$route.params.char;

			if (this.parametri.naziv)
				params.naziv = this.parametri.naziv;
			if (this.filter.edicija)
				params.edicija = this.filter.edicija;
			if (this.filter.izdavac)
				params.izdavac = this.filter.izdavac;
			if (this.filter.scenario)
				params.scenario = this.filter.scenario;
			if (this.filter.crtez)
				params.crtez = this.filter.crtez;

			if (this.showCollectionItems) {
				this.filterCollection(params);
				return;
			}

			// get character comics
			let [data] = await this.$api.comicsChar.$get(params);
			if (data) {
				// set data for table
				this.data = data.content;
				// set pagination from response
				this.$utils.setPagination(data);
				// save current component state
				this.$utils.autoSave();
			}
			// hide loading spinner
			this.loading = false;
		},
		async getLists() {
			// get parameters for get request
			let params = this.$utils.getParams();
			params.char = this.$route.params.char;
			params.lists = true;

			// get starter data
			let [data] = await this.$api.comicsChar.$get(params);
			if (data) {
				this.edicije = data.edicije;
				this.izdavaci = data.izdavaci;
				this.scenaristi = data.scenaristi;
				this.crtezi = data.crtezi;
			}
		},
		remove(record) {
			this.$buefy.dialog.confirm({
				title: 'Delete',
				message: 'Do you want to delete: ' + record.naziv,
				type: 'is-danger',
				onConfirm: () => {
					// show loading spinner
					this.loading = true;
					// send delete request
					this.$api.comicsChar.$deleteOne({char: this.char, id: record._id});
					// hide loading spinner
					this.loading = false;
				}
			});
		},
		async getCollection() {
			try {
				// get parameters for get request
				let params = this.$utils.getParams();
				params.char = this.$route.params.char;
				params.user = this.user._id;

				let data = await this.$api.collections.get(params);
				if (data) {
					this.collectionId = data.body._id;
					// set data for table
					this.collectionData = data.body.comicCollection;
					// set pagination from response
					// this.$utils.setPagination(data);
				}
			}
			catch (error) {
				// pass error to response error handler
				console.log('error', error);
				// this.$utils.handleResponseError(error);
			}
		},
		async showCollection() {
			await this.getCollection();
			this.data = this.collectionData;
			this.showCollectionItems = true;
		},
		showAllComics() {
			this.showCollectionItems = false;
			this.getComics();
		},
		async addToCollection(comicId) {
			let params = {};
			let data = null;
			params.char = this.$route.params.char;
			params.user = this.user._id;

			if (this.collectionId)
				params.id = this.collectionId;

			try {
				if (!this.collectionId) {
					data = await this.$api.collections.save(params, {comicCollection: comicId});
					this.collectionId = data._id;
				}
				else
					data = await this.$api.collections.update(params, {id: comicId});

				this.$buefy.toast.open({
					message: 'Strip dodat u kolekciju!',
					type: 'is-success'
				});
			}
			catch (error) {
				// pass error to response error handler
				this.$utils.handleResponseError(error);
			}
		},
		async removeFromCollection(record) {
			let params = {};
			// let data = null;
			params.char = this.$route.params.char;
			params.user = this.user._id;
			params.id = this.collectionId;
			params.removeFromCollection = true;

			await this.$api.collections.update(params, {id: record._id});

			this.collectionData = this.data = this.data.filter(el => {
				return el._id !== record._id;
			});

			this.$buefy.toast.open({
				message: 'Strip uklonjen iz kolekcije!',
				type: 'is-success'
			});
		},
		filterCollection(params) {
			if (params.naziv) {
				let regexNaziv = new RegExp(`^${params.naziv}`, 'i');

				this.data = this.data.filter(el => regexNaziv.test(el.naziv));
			}

			if (params.izdavac) {
				this.data = this.data.filter(el => {
					return el.izdavac === params.izdavac;
				});
			}

			if (params.edicija) {
				this.data = this.data.filter(el => {
					return el.edicija === params.edicija;
				});
			}

			if (params.scenario) {
				this.data = this.data.filter(el => {
					return el.scenario === params.scenario;
				});
			}

			if (params.crtez) {
				this.data = this.data.filter(el => {
					return el.crtez === params.crtez;
				});
			}
			// hide loading spinner
			this.loading = false;
		},
		resetFilter() {
			// reset data
			this.data = this.collectionData;

			// reset params
			this.parametri.naziv = null;
			this.filter.edicija = null;
			this.filter.izdavac = null;
			this.filter.scenario = null;
			this.filter.crtez = null;

			// hide loading spinner
			this.loading = false;
		}
	}
};
</script>

<style scoped>
	.custom-btn {
		width: 100px;
		height: 36px;
		margin-top: 6px;
	}
</style>
