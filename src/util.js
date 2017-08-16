const asset_root = "http://jp-r.sokka.cn/";
const icon_root = "http://jp-r.sokka.cn/png/icon_from_unit_id/";
const api_server = "https://llsif.sokka.cn/api/";
const removable_skill_map = "http://jp-r.sokka.cn/dist/removable_skill.min.json";
const live_map = "http://jp-r.sokka.cn/dist/maps_dict.min.json";
function getkey(key) {
    return localStorage.getItem(key) || null
}
function setkey(key, value) {
    return localStorage.setItem(key, value)
}
export default{
    asset_root,
    icon_root,
    api_server,
    removable_skill_map,
    live_map,
    getkey,
    setkey
}