<script lang="ts">
  import { afterUpdate, createEventDispatcher } from "svelte"

  export let exercice
  let nbQuestions: number
  let duration: number
  let sup: string | boolean
  let sup2: string | boolean
  let sup3: string | boolean
  let sup4: string | boolean
  let alea: string
  let correctionDetaillee: boolean
  let premierUpdate: boolean = true

  // pour récupérer les tooltips de l'exercice
  type FormNumerique = {
    titre: string
    champs: string[] | string
  }
  let formNum1: FormNumerique
  let formNum2: FormNumerique
  let formNum3: FormNumerique
  let formNum4: FormNumerique

  type FormText = {
    titre: string
    consigne: string
    champsDecortiques: any[]
  }

  afterUpdate(async () => {
    // On ne remplit les champs que la première fois
    if (exercice && premierUpdate) {
      premierUpdate = false
      nbQuestions = exercice.nbQuestions
      duration = exercice.duration || 10
      if (exercice.sup === "false") {
        sup = false
      } else {
        sup = exercice.sup
      }
      sup2 = exercice.sup2
      sup3 = exercice.sup3
      sup4 = exercice.sup4
      alea = exercice.seed
      correctionDetaillee = exercice.correctionDetaillee
    }
  })

  const dispatch = createEventDispatcher()

  function newSettings() {
    dispatch("settings", {
      nbQuestions,
      duration,
      sup,
      sup2,
      sup3,
      sup4,
      alea,
      correctionDetaillee,
    })
  }
  /**
   * Transforme le tableau des tooltips d'un paramètre type numérique en un objet
   * constitué d'un titre (celui du paramètre) et soit d'un tableau
   * des options, soit d'un nombre correspond à la valeur maximale.
   * <i>Référence :</i> commentaire du fichier Exercice.ts sur la propriété
   * <code>besoinFormulaireNumérique</code> (<code>false</code>
   * sinon this.besoinFormulaireNumerique = [texte, max, tooltip facultatif])
   * @param {string[]} entreesFormulaire Typiquement la valeur de la propriété
   * <code>besoinFormulaireNumérique</code>
   * @author sylvain chambon
   */
  function parseFormNumerique(entreesFormulaire: string[]) {
    let entrees: string[] = [...entreesFormulaire]
    let titre: string = entrees.shift() // le titre du paramètre est le 1er elt
    let champs: string[] | string
    if (entrees.length > 1) {
      // il y a une liste de tooltips qui deviendront les entrées
      champs = entrees
        .pop()
        .split("\n")
        .map((x) => x.replace(/(?:\d *: *)/i, ""))
    } else {
      // les champs se résument à un seul nombre correspondant au maximum
      champs = entrees[0]
    }
    return { titre, champs }
  }
  // fabrication des objets correspondant aux paramètres numériques.
  if (exercice.besoinFormulaireNumerique) {
    formNum1 = parseFormNumerique(exercice.besoinFormulaireNumerique)
  }
  if (exercice.besoinFormulaire2Numerique) {
    formNum2 = parseFormNumerique(exercice.besoinFormulaire2Numerique)
  }
  if (exercice.besoinFormulaire3Numerique) {
    formNum3 = parseFormNumerique(exercice.besoinFormulaire3Numerique)
  }
  if (exercice.besoinFormulaire4Numerique) {
    formNum4 = parseFormNumerique(exercice.besoinFormulaire4Numerique)
  }

  /**
   * Transforme le tableau des tooltips d'un paramètre type texte en un objet
   * constitué d'un titre (celui du paramètre), de la consigne (sur quoi influe
   * le paramètre) et d'un tableau des options.
   * <i>Référence :</i> commentaire du fichier Exercice.ts sur la propriété
   * <code>besoinFormulaireTexte</code> (<code>false</code>
   * sinon this.besoinFormulaireTexte = [texte, tooltip])
   * @param {string[]} entreesFormulaire Typiquement la valeur de la propriété
   * <code>besoinFormulaireTexte</code>
   * @author sylvain chambon
   */
  function parseFormTexte(entreesFormulaire: string[]) {
    let entrees: string[] = [...entreesFormulaire]
    let titre: string = entrees.shift() // le titre du formulaire est le 1er elt
    let champs: string[] = entrees.pop().split("\n")
    let consigne: string = champs.shift() // premier éléments est la consigne
    let champsDecortiques: any[] = []
    champs.forEach((entree) => {
      // avant ' : ' c'est la valeur d'activation et après c'est le paramètre
      let parties: string[] = entree.split(" : ")
      champsDecortiques.push({ parametre: parties[1], valeur: parties[0] })
    })
    return { titre, consigne, champsDecortiques }
  }
  // // fabrication des objets correspondant aux paramètres texte.
  // if (exercice.besoinFormulaireTexte) {
  //   formText1 = parseFormTexte(exercice.besoinFormulaireTexte)
  // }
  // if (exercice.besoinFormulaire2Texte) {
  //   formText2 = parseFormTexte(exercice.besoinFormulaire2Texte)
  // }
  // if (exercice.besoinFormulaire3Texte) {
  //   formText3 = parseFormTexte(exercice.besoinFormulaire3Texte)
  // }
  // if (exercice.besoinFormulaire4Texte) {
  //   formText4 = parseFormTexte(exercice.besoinFormulaire4Texte)
  // }

  /**
   *
   * @param {string} formId id du formulaire
   * @author sylvain chambon
   */
  function submitOnSliderChange(formId: string) {
    const e = document.getElementById(formId as string) as HTMLFormElement
    const formData = new FormData(e as HTMLFormElement)
    const data: string[] = []
    for (let field of formData) {
      const [key, value] = field
      // chaque curseur est nommé 'paramTextX-idNumY'
      // où 'X' est le numéro du besoinFormulaireTextX
      // et 'Y' l'indice correspondant au paramètre
      for (let i = 0; i < parseInt(value); i++) {
        data.push(key.charAt(key.length - 1))
      }
    }
    // chaque formulaire est nommé 'formTextX' où X est l'indice du sup
    switch (formId.charAt(formId.length - 1)) {
      case "1":
        sup = data.join("-")
        break
      case "2":
        sup2 = data.join("-")
        break
      case "3":
        sup3 = data.join("-")
        break
      case "4":
        sup4 = data.join("-")
        break
    }
    newSettings()
  }
</script>

<div class="text-2xl lg:text-base ml-2 lg:mx-4 space-y-4 p-3 rounded-md">
  <h3 class="text-coopmaths font-bold">Paramètres</h3>
  {#if !exercice.nbQuestionsModifiable && !exercice.besoinFormulaireCaseACocher && !exercice.besoinFormulaireNumerique && !exercice.besoinFormulaireTexte}
    <div class="italic">Cet exercice ne peut pas être paramétré.</div>
  {/if}
  {#if exercice.nbQuestionsModifiable}
    <div>
      <span class="text-coopmaths-lightest">Nombre de questions :</span>
      <input
        type="number"
        min="1"
        bind:value={nbQuestions}
        on:change={newSettings}
        class="w-full border-2 border-transparent focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 bg-white"
      />
    </div>
  {/if}
  <div>
    <span class="text-coopmaths-lightest">Durée d'une question pour le diaporama :</span>
    <input type="number" min="1" bind:value={duration} on:change={newSettings} class="w-full border-2 border-transparent focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 bg-white" />
  </div>
  {#if exercice.besoinFormulaireCaseACocher}
    <div class="form-check">
      <label class="form-check-label text-coopmaths-lightest" for="check1">
        {exercice.besoinFormulaireCaseACocher[0]} :
      </label>
      <input name="check1" type="checkbox" class="form-check-input text-coopmaths focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2" bind:checked={sup} on:change={newSettings} />
    </div>
  {/if}
  {#if exercice.besoinFormulaireNumerique}
    {#if Array.isArray(formNum1.champs)}
      <div class="flex flex-col">
        <form action="">
          <label class="text-coopmaths-lightest" for="formNum1">{formNum1.titre}</label>
          <select
            class="flex flex-auto w-full border-2 border-transparent focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 bg-white"
            name="formNum1"
            id="formNum1-select"
            bind:value={sup}
            on:change={newSettings}
          >
            {#each formNum1.champs as entree, i}
              <option value={i + 1}>{entree}</option>
            {/each}
          </select>
        </form>
      </div>
    {:else}
      <div>
        <!-- Il faudra gérer l'absence de tooltip -->
        <label class="text-coopmaths-lightest" for="formNum1">{exercice.besoinFormulaireNumerique[0]} :</label>
        <input
          name="formNum1"
          type="number"
          class="w-16 border-2"
          min="1"
          max={exercice.besoinFormulaireNumerique[1]}
          data-bs-toggle="tooltip"
          title={exercice.besoinFormulaireNumerique[2] || ""}
          bind:value={sup}
          on:change={newSettings}
        />
      </div>
    {/if}
  {/if}
  {#if exercice.besoinFormulaireTexte}
    <div class="tooltip tooltip-left" data-tip={exercice.besoinFormulaireTexte[1]}>
      <form id="formText1" name="formText1" on:submit|preventDefault={newSettings}>
        <label class="text-coopmaths-lightest" for="formText1">{exercice.besoinFormulaireTexte[0]} :</label>
        <input class="w-full border-2 border-transparent focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 bg-white" name="formText1" type="text" bind:value={sup} />
        <!-- <fieldset>
          <legend class="text-coopmaths-lightest">{formText1.titre}</legend>
          <div class="flex flex-col  ml-3 mt-1">
            {#each formText1.champsDecortiques as entree, i}
              <div class="flew-row space-x-2">
                <Curseur
                  on:curseurNotif={() => submitOnSliderChange("formText1")}
                  titre={entree.parametre}
                  montant={0}
                  identifiant={["paramText1-", i + 1, "-curseur"].join("")}
                  nom={["paramText1-idNum-", entree.valeur].join("")}
                  max={nbQuestions}
                />
              </div>
            {/each}
          </div>
        </fieldset> -->
      </form>
    </div>
  {/if}

  <!-- sup2 -->
  {#if exercice.besoinFormulaire2CaseACocher}
    <div class="form-check">
      <label class="form-check-label text-coopmaths-lightest" for="check2">{exercice.besoinFormulaire2CaseACocher[0]} : </label>
      <input
        name="check2"
        type="checkbox"
        class="form-check-input text-coopmaths focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 checkbox-primary"
        bind:checked={sup2}
        on:change={newSettings}
      />
    </div>
  {/if}
  {#if exercice.besoinFormulaire2Numerique}
    {#if Array.isArray(formNum2.champs)}
      <div class="flex flex-col">
        <form action="">
          <label class="text-coopmaths-lightest" for="formNum2">{formNum2.titre}</label>
          <select
            class="flex flex-auto  w-full border-2 border-transparent focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 bg-white"
            name="formNum2"
            id="formNum2-select"
            bind:value={sup2}
            on:change={newSettings}
          >
            {#each formNum2.champs as entree, i}
              <option value={i + 1}>{entree}</option>
            {/each}
          </select>
        </form>
      </div>
    {:else}
      <div>
        <!-- Il faudra gérer l'absence de tooltip -->
        <label class="text-coopmaths-lightest" for="formNum2">{exercice.besoinFormulaire2Numerique[0]} :</label>
        <input
          name="formNum2"
          type="number"
          class="w-full border-2 border-transparent focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 bg-white"
          min="1"
          max={exercice.besoinFormulaire2Numerique[1]}
          data-bs-toggle="tooltip"
          title={exercice.besoinFormulaire2Numerique[2] || ""}
          bind:value={sup2}
          on:change={newSettings}
        />
      </div>
    {/if}
  {/if}
  {#if exercice.besoinFormulaire2Texte}
    <div class=" tooltip tooltip-left" data-tip={exercice.besoinFormulaire2Texte[1]}>
      <form id="formText2" name="formText2" on:submit|preventDefault={newSettings}>
        <label class="text-coopmaths-lightest" for="formText2">{exercice.besoinFormulaire2Texte[0]} :</label>
        <input class="w-full border-2 border-transparent focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 bg-white" name="formText2" type="text" bind:value={sup2} />
        <!-- <fieldset>
          <legend class="text-coopmaths-lightest">{formText2.titre}</legend>
          <div class="flex flex-col  ml-3 mt-1">
            {#each formText2.champsDecortiques as entree, i}
              <div class="flew-row space-x-2">
                <Curseur
                  on:curseurNotif={() => submitOnSliderChange("formText2")}
                  titre={entree.parametre}
                  montant={0}
                  identifiant={["paramText2-", i + 1, "-curseur"].join("")}
                  nom={["paramText2-idNum-", entree.valeur].join("")}
                  max={nbQuestions}
                />
              </div>
            {/each}
          </div>
        </fieldset> -->
      </form>
    </div>
  {/if}

  <!-- sup3 -->
  {#if exercice.besoinFormulaire3CaseACocher}
    <div class="form-check">
      <label class="form-check-label text-coopmaths-lightest" for="check3">{exercice.besoinFormulaire3CaseACocher[0]} : </label>
      <input
        name="check3"
        type="checkbox"
        class="form-check-input text-coopmaths focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 checkbox-primary"
        bind:checked={sup3}
        on:change={newSettings}
      />
    </div>
  {/if}
  {#if exercice.besoinFormulaire3Numerique}
    {#if Array.isArray(formNum3.champs)}
      <div class="flex flex-col">
        <form action="">
          <label class="text-coopmaths-lightest" for="formNum3">{formNum3.titre}</label>
          <select class="flex flex-auto" name="formNum3" id="formNum3-select" bind:value={sup3} on:change={newSettings}>
            {#each formNum3.champs as entree, i}
              <option value={i + 1}>{entree}</option>
            {/each}
          </select>
        </form>
      </div>
    {:else}
      <div>
        <!-- Il faudra gérer l'absence de tooltip -->
        <label class="text-coopmaths-lightest" for="formNum3">{exercice.besoinFormulaire3Numerique[0]} :</label>
        <input
          name="formNum3"
          type="number"
          class="w-full border-2 border-transparent focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 bg-white"
          min="1"
          max={exercice.besoinFormulaire3Numerique[1]}
          data-bs-toggle="tooltip"
          title={exercice.besoinFormulaire3Numerique[2] || ""}
          bind:value={sup3}
          on:change={newSettings}
        />
      </div>
    {/if}
  {/if}
  {#if exercice.besoinFormulaire3Texte}
    <div class=" tooltip tooltip-left" data-tip={exercice.besoinFormulaire3Texte[1]}>
      <form id="formText3" name="formText3" on:submit|preventDefault={newSettings}>
        <label class="text-coopmaths-lightest" for="formText3">{exercice.besoinFormulaire3Texte[0]} :</label>
        <input class="w-full border-2 border-transparent focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 bg-white" name="formText3" type="text" bind:value={sup3} />
        <!-- <div>
      <form id="formText3" name="formText3">
        <fieldset>
          <legend class="text-coopmaths-lightest">{formText3.titre}</legend>
          <div class="flex flex-col  ml-3 mt-1">
            {#each formText3.champsDecortiques as entree, i}
              <div class="flew-row space-x-2">
                <Curseur
                  on:curseurNotif={() => submitOnSliderChange("formText3")}
                  titre={entree.parametre}
                  montant={0}
                  identifiant={["paramText3-", i + 1, "-curseur"].join("")}
                  nom={["paramText3-idNum-", entree.valeur].join("")}
                  max={nbQuestions}
                />
              </div>
            {/each}
          </div>
        </fieldset> -->
      </form>
    </div>
  {/if}

  <!-- sup4 -->
  {#if exercice.besoinFormulaire4CaseACocher}
    <div class="form-check">
      <label class="form-check-label text-coopmaths-lightest" for="check4">{exercice.besoinFormulaire4CaseACocher[0]} : </label>
      <input
        name="check4"
        type="checkbox"
        class="form-check-input text-coopmaths focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 checkbox-primary"
        bind:checked={sup4}
        on:change={newSettings}
      />
    </div>
  {/if}
  {#if exercice.besoinFormulaire4Numerique}
    {#if Array.isArray(formNum4.champs)}
      <div class="flex flex-col">
        <form action="">
          <label class="text-coopmaths-lightest" for="formNum4">{formNum4.titre}</label>
          <select
            class="flex flex-auto w-full border-2 border-transparent focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 bg-white"
            name="formNum4"
            id="formNum4-select"
            bind:value={sup4}
            on:change={newSettings}
          >
            {#each formNum4.champs as entree, i}
              <option value={i + 1}>{entree}</option>
            {/each}
          </select>
        </form>
      </div>
    {:else}
      <div>
        <!-- Il faudra gérer l'absence de tooltip -->
        <label class="text-coopmaths-lightest" for="formNum4">{exercice.besoinFormulaire4Numerique[0]} :</label>
        <input
          name="formNum4"
          type="number"
          class="w-full border-2 border-transparent focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 bg-white"
          min="1"
          max={exercice.besoinFormulaire4Numerique[1]}
          data-bs-toggle="tooltip"
          title={exercice.besoinFormulaire4Numerique[2] || ""}
          bind:value={sup4}
          on:change={newSettings}
        />
      </div>
    {/if}
  {/if}
  {#if exercice.besoinFormulaire4Texte}
    <div class="tooltip tooltip-left" data-tip={exercice.besoinFormulaire4Texte[1]}>
      <form id="formText4" name="formText4" on:submit|preventDefault={newSettings}>
        <label class="text-coopmaths-lightest" for="formText4">{exercice.besoinFormulaire4Texte[0]} :</label>
        <input class="w-full border-2 border-transparent focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 bg-white" name="formText4" type="text" bind:value={sup4} />
      </form>
    </div>
    <!-- <div>
      <form id="formText4" name="formText4">
        <fieldset>
          <legend class="text-coopmaths-lightest">{formText4.titre}</legend>
          <div class="flex flex-col  ml-3 mt-1">
            {#each formText4.champsDecortiques as entree, i}
              <div class="flew-row space-x-2">
                <Curseur
                  on:curseurNotif={() => submitOnSliderChange("formText4")}
                  titre={entree.parametre}
                  montant={0}
                  identifiant={["paramText4-", i + 1, "-curseur"].join("")}
                  nom={["paramText4-idNum-", entree.valeur].join("")}
                  max={nbQuestions}
                />
              </div>
            {/each}
          </div>
        </fieldset>
      </form>
    </div> -->
  {/if}

  {#if exercice.correctionDetailleeDisponible}
    <div>
      <span class="text-coopmaths-lightest">Correction détaillée :</span>
      <input type="checkbox" class="form-check-input text-coopmaths focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2" bind:checked={correctionDetaillee} on:change={newSettings} />
    </div>
  {/if}
  <form id="formAlea" name="formAlea" on:submit|preventDefault={newSettings}>
    <label class="text-coopmaths-lightest" for="formAlea">Série :</label>
    <input class="w-full border-2 border-transparent focus:border-coopmaths focus:outline-0 focus:ring-0 focus:border-2 bg-white" name="formAlea" type="text" bind:value={alea} />
  </form>
</div>
