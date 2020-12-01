/**
 * ALICE Bookkeeping
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.0.0
 *
 * NOTE: This class is auto generated by OpenAPI-Generator 5.0.0-beta2.
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/*
 * Errors.h
 *
 * A list of Error objects.
 */

#ifndef ORG_OPENAPITOOLS_CLIENT_MODEL_Errors_H_
#define ORG_OPENAPITOOLS_CLIENT_MODEL_Errors_H_


#include "../ModelBase.h"

#include "Error.h"
#include <vector>

namespace org {
namespace openapitools {
namespace client {
namespace model {


/// <summary>
/// A list of Error objects.
/// </summary>
class  Errors
    : public ModelBase
{
public:
    Errors();
    virtual ~Errors();

    /////////////////////////////////////////////
    /// ModelBase overrides

    void validate() override;

    web::json::value toJson() const override;
    bool fromJson(const web::json::value& json) override;

    void toMultipart(std::shared_ptr<MultipartFormData> multipart, const utility::string_t& namePrefix) const override;
    bool fromMultiPart(std::shared_ptr<MultipartFormData> multipart, const utility::string_t& namePrefix) override;

    /////////////////////////////////////////////
    /// Errors members

    /// <summary>
    /// A list of Error objects.
    /// </summary>
    std::vector<std::shared_ptr<Error>>& getErrors();
    bool errorsIsSet() const;
    void unsetErrors();

    void setErrors(const std::vector<std::shared_ptr<Error>>& value);


protected:
    std::vector<std::shared_ptr<Error>> m_Errors;
    bool m_ErrorsIsSet;
};


}
}
}
}

#endif /* ORG_OPENAPITOOLS_CLIENT_MODEL_Errors_H_ */