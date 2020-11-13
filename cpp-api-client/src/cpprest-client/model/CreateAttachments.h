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
 * CreateAttachments.h
 *
 * Describes an attachment
 */

#ifndef ORG_OPENAPITOOLS_CLIENT_MODEL_CreateAttachments_H_
#define ORG_OPENAPITOOLS_CLIENT_MODEL_CreateAttachments_H_


#include "../ModelBase.h"

#include "Attachment.h"
#include <vector>

namespace org {
namespace openapitools {
namespace client {
namespace model {


/// <summary>
/// Describes an attachment
/// </summary>
class  CreateAttachments
    : public ModelBase
{
public:
    CreateAttachments();
    virtual ~CreateAttachments();

    /////////////////////////////////////////////
    /// ModelBase overrides

    void validate() override;

    web::json::value toJson() const override;
    bool fromJson(const web::json::value& json) override;

    void toMultipart(std::shared_ptr<MultipartFormData> multipart, const utility::string_t& namePrefix) const override;
    bool fromMultiPart(std::shared_ptr<MultipartFormData> multipart, const utility::string_t& namePrefix) override;

    /////////////////////////////////////////////
    /// CreateAttachments members

    /// <summary>
    /// A list of attachment objects.
    /// </summary>
    std::vector<std::shared_ptr<Attachment>>& getAttachments();
    bool attachmentsIsSet() const;
    void unsetAttachments();

    void setAttachments(const std::vector<std::shared_ptr<Attachment>>& value);


protected:
    std::vector<std::shared_ptr<Attachment>> m_Attachments;
    bool m_AttachmentsIsSet;
};


}
}
}
}

#endif /* ORG_OPENAPITOOLS_CLIENT_MODEL_CreateAttachments_H_ */
