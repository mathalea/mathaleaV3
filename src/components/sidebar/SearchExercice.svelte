<script>
    import { listeExercices } from "../store"
    export let referentiel

    /**
     * Retourne tous les objets qui ont une clé titre
     */
    function getAllExercices() {
        const exercices = [];
        function recursiveSearch(object) {
            Object.keys(object).forEach((key) => {
                const value = object[key];
                if (key === "titre" && typeof value !== "object") {
                    exercices.push(object);
                } else if (typeof value === "object") {
                    recursiveSearch(value);
                }
            });
        }
        recursiveSearch(referentiel);
        return exercices;
    }

    let listeDesExercices = getAllExercices();
    let filteredList;
    let isCanInclusDansResultats;

    $: {
        referentiel = referentiel
        listeDesExercices = getAllExercices()
        filteredList = listeDesExercices.filter((exercice) =>
            filtre(exercice, inputSearch, isCanInclusDansResultats)
        );
    }
    let inputSearch = "";

    /**
     * Détermine si un exercice est dans les résultats de la recherche ou pas
     */
    function filtre(exercice, inputSearch, isCanPossible) {
        if (!inputSearch) return false;
        const inputs = inputSearch.split(" ");
        let results = [];
        for (const input of inputs) {
            if (!exercice.id) console.log(exercice)
            results.push(
                exercice.titre.toLowerCase().includes(input.toLowerCase()) ||
                    exercice.id.toLowerCase().includes(input.toLowerCase())
            );
        }
        if (!isCanPossible) {
            results.push(!exercice.id.includes("can"))
        } 
        return results.every((value) => value === true)
    }

    /**
     * Ajouter l'exercice courant à la liste
     */
    function addToList(exercice) {
        const newExercise = {
            url: exercice.url,
            id: exercice.id,
            uuid: exercice.uuid,
        };
        listeExercices.update((list) => [...list, newExercise]);
    }
</script>

<div class="mb-2 items-center font-bold text-large">Recherche</div>
<div class="mb-2 ml-1">
    <input type="text" bind:value={inputSearch} />
</div>
{#if inputSearch.length > 0}
    <div class="mb-4">
        Inclure les courses aux nombres : <input
            type="checkbox"
            bind:checked={isCanInclusDansResultats}
        />
    </div>
{/if}

{#each filteredList as exercice}
    <div class="relative flex flex-row items-center text-sm text-gray-600 bg-gray-400 ml-1">
        <div class="flex-1 hover:bg-coopmaths-lightest cursor-pointer"
            on:click={() => addToList(exercice)}>
            <div class="ml-[3px] pl-2 bg-gray-200 hover:bg-gray-100 flex-1">
                <span class="font-bold">{exercice.id} - </span>{exercice.titre}
            </div>
        </div>
    </div>
{/each}

<style>
    input {
        border: 1px solid transparent;
        background-color: #f1f1f1;
        padding: 4px;
        font-size: 12px;
        margin: 0;
    }
    input[type="text"] {
        width: 98%;
        background-color: #f1f1f1;
    }
</style>
