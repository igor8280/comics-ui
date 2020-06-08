<template>
	<div class="section">
			<div class="columns">
				<div class="column is-one-quarter">
					<div class="field">
						<label class="label">Karakter</label>
						<div class="control">
							<input  class="input" type="text" v-model="comic.lik" placeholder="Karakter" :disabled="access==='R'">
						</div>
					</div>
					<div class="field">
						<label class="label">Izdavac</label>
						<b-checkbox v-model="noviIzdavac"  v-if="access==='RW'">
							{{ noviIzdavac ? 'Novi izdavac' : 'Postojeci' }}
						</b-checkbox>
						<div class="control">
							<input v-if="noviIzdavac" class="input" type="text" v-model="comic.izdavac" placeholder="Izdavac"  :disabled="access==='R'">
							<b-field v-else>
								<b-select class="fixed-width-250" placeholder="Izaberi izdavaca" v-model="comic.izdavac">
									<option
										v-for="izdavac in izdavaci"
										:value="izdavac"
										:key="izdavac">
										{{ izdavac }}
									</option>
								</b-select>
							</b-field>
						</div>
					</div>
					<div class="field">
						<label class="label">Edicija</label>
						<b-checkbox v-model="novaEdicija"  v-if="access==='RW'">
							{{ novaEdicija ? 'Nova edicija' : 'Postojeca' }}
						</b-checkbox>
						<div class="control">
							<input v-if="novaEdicija" class="input" type="text" v-model="comic.edicija" placeholder="Edicija"  :disabled="access==='R'">
							<b-field v-else>
								<b-select class="fixed-width-250" placeholder="Izaberi ediciju" v-model="comic.edicija">
									<option
										v-for="edicija in edicije"
										:value="edicija"
										:key="edicija">
										{{ edicija}}
									</option>
								</b-select>
							</b-field>
						</div>
					</div>
					<div class="field">
						<label class="label">Naziv</label>
						<div class="control">
							<input class="input" type="text" v-model="comic.naziv" placeholder="Naziv"  :disabled="access==='R'">
						</div>
					</div>
					<div class="field">
						<label class="label">Scenario</label>
						<b-checkbox v-model="noviScenarista"  v-if="access==='RW'">
							{{ noviScenarista ? 'Novi scenarista' : 'Postojeci' }}
						</b-checkbox>
						<div class="control">
							<input v-if="noviScenarista" class="input" type="text" v-model="comic.scenario" placeholder="Scenario"  :disabled="access==='R'">
							<b-field v-else>
								<b-select class="fixed-width-250" placeholder="Izaberi scenaristu" v-model="comic.scenario">
									<option
										v-for="scenarista in scenaristi"
										:value="scenarista"
										:key="scenarista">
										{{ scenarista}}
									</option>
								</b-select>
							</b-field>
						</div>
					</div>
					<div class="field">
						<label class="label">Crtez</label>
						<b-checkbox v-model="noviCrtez"  v-if="access==='RW'">
							{{ noviCrtez ? 'Novi crtez' : 'Postojeci' }}
						</b-checkbox>
						<div class="control">
							<input v-if="noviCrtez" class="input" type="text" v-model="comic.crtez" placeholder="Crtez"  :disabled="access==='R'">
							<b-field v-else>
								<b-select class="fixed-width-250" placeholder="Izaberi crtaca" v-model="comic.crtez">
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
					<div class="field">
						<label class="label">Boja</label>
						<div class="control">
							<input class="input" type="text" v-model="comic.boja" placeholder="Boja"  :disabled="access==='R'">
						</div>
					</div>
					<b-field label="Godina">
						<b-numberinput min="1950" v-model="comic.godina"  :disabled="access==='R'"></b-numberinput>
					</b-field>
					<b-field label="Mesec">
						<b-numberinput min="1" max="12" v-model="comic.mesec"  :disabled="access==='R'"></b-numberinput>
					</b-field>
					<b-field label="Broj">
						<b-numberinput min="1" v-model="comic.no"  :disabled="access==='R'"></b-numberinput>
					</b-field>
					<b-field grouped>
						<b-button v-if="$route.params.id==='create'" class="fixed-width-100" type="is-success" v-on:click="create">Submit</b-button>
						<b-button v-if="access==='RW' && $route.params.id!=='create'" class="fixed-width-100" type="is-success" v-on:click="update">Update</b-button>
						<b-button class="fixed-width-100" type="is-warning" v-on:click="goBack">Back</b-button>
					</b-field>
				</div>
				<div class="column"></div>
			</div>
	</div>
</template>

<script>
export default {
	name: 'comics-edit',
	data() {
		return {
			id: this.$route.params.id,
			char: this.$route.params.char,
			noviIzdavac: true,
			novaEdicija: true,
			noviScenarista: true,
			noviCrtez: true,
			izdavaci: [],
			edicije: [],
			scenaristi: [],
			crtezi: [],
			access: JSON.parse(this.$store.getters.user).user.access,
			comic: {
				lik: null,
				izdavac: null,
				edicija: null,
				naziv: null,
				scenario: null,
				crtez: null,
				boja: null,
				no: null,
				godina: null,
				mesec: null,
				parent: null
			},
			loading: false
		};
	},
	mounted() {
		console.log('-----', JSON.parse(this.$store.getters.user).user.access);
		if (this.$route.params.id !== 'create')
			this.getComic();
		else
			this.getLists();
	},
	methods: {
		async getComic() {
			// show loading spinner
			this.loading = true;
			// get parameters for get request
			let params = {
				char: this.$route.params.char,
				id: this.$route.params.id
			};

			// get starter data
			let [data] = await this.$api.comicsChar.$get(params);
			if (data) {
				// set data for editing
				this.comic = data;
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
		goBack() {
			this.$router.go(-1);
		},
		async create() {
			await this.$api.comics.$save(this.comic);
		},
		async update() {
			await this.$api.comicsChar.$update({char: this.char, id: this.id}, this.comic);
		}
	}
};
</script>

<style scoped>
</style>
