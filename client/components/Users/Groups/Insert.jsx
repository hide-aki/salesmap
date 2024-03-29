/// Sys - AutoForm
import Insert from "@imports/ui/crud/Insert";
/// Sys - AutoForm --

/// Custom - AutoForm - collection
import { Users_Groups_Collection } from "@imports/api/Users/Groups_Collection";
console.assert(
  Users_Groups_Collection,
  "Users_Groups_Collection is undefined."
);
/// Custom - AutoForm - collection --

/// Sys - Role
import { checkSystemRole, checkAdminRole } from "@imports/ui/crud/checkRole";
/// Sys - Role --

/// Custom - Role - check permission
/**
 *
 *
 * @param {*} mode
 * @returns
 */
// eslint-disable-next-line no-unused-vars
export const Users_Groups_Insert_ComponentInfo = mode => {
  if (!checkSystemRole()) {
    return null;
  }

  if (!checkAdminRole()) {
    return null;
  }

  return { title: "Users/Groups/Insert", path: "/Users/Groups/Insert" };
};
/// Custom - Role - check permission --

/**
 *
 *
 * @export
 * @class Users_Groups_Insert
 * @extends {Insert}
 */
export class Users_Groups_Insert extends Insert {
  "use strict";

  /**
   *Creates an instance of Users_Groups_Insert.
   * @param {*} props
   * @memberof Users_Groups_Insert
   */
  constructor(props) {
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = Users_Groups_Insert_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - AutoForm - rebuild field
    this.Collection = Users_Groups_Collection;
    this.Form_name = this.Collection._name;
    /// Custom - AutoForm - rebuild field --

    /// Sys - AutoForm - rebuild field
    this.postConstructor();
    /// Sys - AutoForm - rebuild field --
  }
}
