module.exports = function generateEncoding(mappings) {
	var toEntityMap = {}
	var toCharacterMap = {}
	mappings.entities.forEach(function(pair){
		if(mappings.toCharacter.mapping_chooser && toCharacterMap[pair[1]]) {
			toCharacterMap[pair[1]] = mappings.toCharacter.mapping_chooser(toCharacterMap[pair[1]],pair[0])
		}
		if(!toCharacterMap[pair[1]]) {
			toCharacterMap[pair[1]] = pair[0]
		}
	})
	mappings.entities.forEach(function(pair){
		if(mappings.toEntity.mapping_chooser && toEntityMap[pair[1]]) {
			toEntityMap[pair[1]] = mappings.toEntity.mapping_chooser(toEntityMap[pair[1]],pair[0])
		}
		//console.log(pair)
		if(!toEntityMap[pair[0]]) {
			toEntityMap[pair[0]] = pair[1]
		}
	})
	var toEntityMatcher = RegExp(
		mappings.entities.map(function(pair){
			return pair[0].replace(/\W/g,"\\$&")
		}).join("|")+"|"+mappings.toEntity.matcher.source
		,"g"
	)
	var toCharacterMatcher = RegExp(
		mappings.entities.map(function(pair){
			return pair[1].replace(/\W/g,"\\$&")
		}).join("|")+"|"+mappings.toCharacter.matcher.source
		,"g"
	)
	var toEntityMapping = mappings.toEntity.replacement
	var toCharacterMapping = mappings.toCharacter.replacement
	function decode(string) {
		return String(string).replace(toEntityMatcher,function(match) {
			return match in toEntityMap ? toEntityMap[match] : toEntityMapping(match);
		})
	}
	function encode(string) {
		return String(string).replace(toCharacterMatcher,function(match) {
			return match in toCharacterMap ? toCharacterMap[match] : toCharacterMapping(match);
		})
	}
	return {decode:decode,encode:encode}
}