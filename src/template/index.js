const template = `
<% components.forEach(function(component) { -%>
import <%= component.exportName %> from "<%= component.rel %>";
<% }); -%>

export default {
  <% components.forEach(function(component) { -%>
  <%= component.exportName %>,
  <% }); -%>
};
`;
export default template;
