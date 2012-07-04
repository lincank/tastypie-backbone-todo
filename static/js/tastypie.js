/**
 * Created with PyCharm.
 * User: lincank
 * Date: 7/3/12
 * Time: 7:04 PM
 * To change this template use File | Settings | File Templates.
 *  * IMPORTANT: * This file should place after Backbone and Underscore
 */


// Copy from Backbone
// Helper function to get a URL from a Model or Collection as a property
// or as a function.
var getUrl = function (object) {
    if (!(object && object.url)) return null;
    return _.isFunction(object.url) ? object.url() : object.url;
};

// Throw an error when a URL is needed, and none is supplied.
var urlError = function () {
    throw new Error("A 'url' property or function must be specified");
};




Backbone.Model.prototype.url = function () {
    var base = getUrl(this.collection) || this.urlRoot || urlError();
    if (this.isNew()) return base;

    // "resource_uri" is an auto-generated field after a resource is defined
    if (this.get("resource_uri")) return this.get("resource_uri");
    return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + encodeURIComponent(this.id) + "/";
}


Backbone.Collection.prototype.reset = function (models, options) {

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any `added` or `removed` events. Fires `reset` when finished.

    models || (models = []);
    options || (options = {});

    // modified for Tastypie, because it return a meta and list of objects in response
    if (models.objects || models.meta) models = models.objects;

    this.each(this._removeReference);
    this._reset();
    this.add(models, {silent:true});
    if (!options.silent) this.trigger('reset', this, options);
    return this;

}
