const JavaModelTemplate = 
`package com.luisot.codegen.model;

{{#hasBigDecimal}}import java.math.BigDecimal;{{/hasBigDecimal}}
{{#hasLocalDateTime}}import java.time.LocalDateTime;{{/hasLocalDateTime}}

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "{{tableName}}")
@Getter
@Setter
public class {{className}} {
    {{#columns}}
    {{#primaryKey}}
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY){{/primaryKey}}
    {{#primaryKey}}
    @Column(name = "{{columnName}}")
    {{/primaryKey}}
    {{^primaryKey}}
    @Column(name = "{{columnName}}"{{#columnSize}}, length = {{columnSize}}{{/columnSize}}{{#notNull}}, nullable = false{{/notNull}})
    {{/primaryKey}}
    @JsonProperty("{{columnName}}")
    private {{columnType}} {{columnAttributeName}};
    {{/columns}}

}
`;

exports.JavaModelTemplate = JavaModelTemplate;