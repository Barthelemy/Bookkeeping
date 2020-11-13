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



#include "LogSortOptions.h"

namespace org {
namespace openapitools {
namespace client {
namespace model {




LogSortOptions::LogSortOptions()
{
    m_AuthorIsSet = false;
    m_CreatedAtIsSet = false;
    m_IdIsSet = false;
    m_TagsIsSet = false;
    m_TitleIsSet = false;
}

LogSortOptions::~LogSortOptions()
{
}

void LogSortOptions::validate()
{
    // TODO: implement validation
}

web::json::value LogSortOptions::toJson() const
{

    web::json::value val = web::json::value::object();
    
    if(m_AuthorIsSet)
    {
        val[utility::conversions::to_string_t("author")] = ModelBase::toJson(m_Author);
    }
    if(m_CreatedAtIsSet)
    {
        val[utility::conversions::to_string_t("createdAt")] = ModelBase::toJson(m_CreatedAt);
    }
    if(m_IdIsSet)
    {
        val[utility::conversions::to_string_t("id")] = ModelBase::toJson(m_Id);
    }
    if(m_TagsIsSet)
    {
        val[utility::conversions::to_string_t("tags")] = ModelBase::toJson(m_Tags);
    }
    if(m_TitleIsSet)
    {
        val[utility::conversions::to_string_t("title")] = ModelBase::toJson(m_Title);
    }

    return val;
}

bool LogSortOptions::fromJson(const web::json::value& val)
{
    bool ok = true;
    
    if(val.has_field(utility::conversions::to_string_t("author")))
    {
        const web::json::value& fieldValue = val.at(utility::conversions::to_string_t("author"));
        if(!fieldValue.is_null())
        {
            std::shared_ptr<SortOrder> refVal_author;
            ok &= ModelBase::fromJson(fieldValue, refVal_author);
            setAuthor(refVal_author);
        }
    }
    if(val.has_field(utility::conversions::to_string_t("createdAt")))
    {
        const web::json::value& fieldValue = val.at(utility::conversions::to_string_t("createdAt"));
        if(!fieldValue.is_null())
        {
            std::shared_ptr<SortOrder> refVal_createdAt;
            ok &= ModelBase::fromJson(fieldValue, refVal_createdAt);
            setCreatedAt(refVal_createdAt);
        }
    }
    if(val.has_field(utility::conversions::to_string_t("id")))
    {
        const web::json::value& fieldValue = val.at(utility::conversions::to_string_t("id"));
        if(!fieldValue.is_null())
        {
            std::shared_ptr<SortOrder> refVal_id;
            ok &= ModelBase::fromJson(fieldValue, refVal_id);
            setId(refVal_id);
        }
    }
    if(val.has_field(utility::conversions::to_string_t("tags")))
    {
        const web::json::value& fieldValue = val.at(utility::conversions::to_string_t("tags"));
        if(!fieldValue.is_null())
        {
            std::shared_ptr<SortOrder> refVal_tags;
            ok &= ModelBase::fromJson(fieldValue, refVal_tags);
            setTags(refVal_tags);
        }
    }
    if(val.has_field(utility::conversions::to_string_t("title")))
    {
        const web::json::value& fieldValue = val.at(utility::conversions::to_string_t("title"));
        if(!fieldValue.is_null())
        {
            std::shared_ptr<SortOrder> refVal_title;
            ok &= ModelBase::fromJson(fieldValue, refVal_title);
            setTitle(refVal_title);
        }
    }
    return ok;
}

void LogSortOptions::toMultipart(std::shared_ptr<MultipartFormData> multipart, const utility::string_t& prefix) const
{
    utility::string_t namePrefix = prefix;
    if(namePrefix.size() > 0 && namePrefix.substr(namePrefix.size() - 1) != utility::conversions::to_string_t("."))
    {
        namePrefix += utility::conversions::to_string_t(".");
    }
    if(m_AuthorIsSet)
    {
        multipart->add(ModelBase::toHttpContent(namePrefix + utility::conversions::to_string_t("author"), m_Author));
    }
    if(m_CreatedAtIsSet)
    {
        multipart->add(ModelBase::toHttpContent(namePrefix + utility::conversions::to_string_t("createdAt"), m_CreatedAt));
    }
    if(m_IdIsSet)
    {
        multipart->add(ModelBase::toHttpContent(namePrefix + utility::conversions::to_string_t("id"), m_Id));
    }
    if(m_TagsIsSet)
    {
        multipart->add(ModelBase::toHttpContent(namePrefix + utility::conversions::to_string_t("tags"), m_Tags));
    }
    if(m_TitleIsSet)
    {
        multipart->add(ModelBase::toHttpContent(namePrefix + utility::conversions::to_string_t("title"), m_Title));
    }
}

bool LogSortOptions::fromMultiPart(std::shared_ptr<MultipartFormData> multipart, const utility::string_t& prefix)
{
    bool ok = true;
    utility::string_t namePrefix = prefix;
    if(namePrefix.size() > 0 && namePrefix.substr(namePrefix.size() - 1) != utility::conversions::to_string_t("."))
    {
        namePrefix += utility::conversions::to_string_t(".");
    }

    if(multipart->hasContent(utility::conversions::to_string_t("author")))
    {
        std::shared_ptr<SortOrder> refVal_author;
        ok &= ModelBase::fromHttpContent(multipart->getContent(utility::conversions::to_string_t("author")), refVal_author );
        setAuthor(refVal_author);
    }
    if(multipart->hasContent(utility::conversions::to_string_t("createdAt")))
    {
        std::shared_ptr<SortOrder> refVal_createdAt;
        ok &= ModelBase::fromHttpContent(multipart->getContent(utility::conversions::to_string_t("createdAt")), refVal_createdAt );
        setCreatedAt(refVal_createdAt);
    }
    if(multipart->hasContent(utility::conversions::to_string_t("id")))
    {
        std::shared_ptr<SortOrder> refVal_id;
        ok &= ModelBase::fromHttpContent(multipart->getContent(utility::conversions::to_string_t("id")), refVal_id );
        setId(refVal_id);
    }
    if(multipart->hasContent(utility::conversions::to_string_t("tags")))
    {
        std::shared_ptr<SortOrder> refVal_tags;
        ok &= ModelBase::fromHttpContent(multipart->getContent(utility::conversions::to_string_t("tags")), refVal_tags );
        setTags(refVal_tags);
    }
    if(multipart->hasContent(utility::conversions::to_string_t("title")))
    {
        std::shared_ptr<SortOrder> refVal_title;
        ok &= ModelBase::fromHttpContent(multipart->getContent(utility::conversions::to_string_t("title")), refVal_title );
        setTitle(refVal_title);
    }
    return ok;
}

std::shared_ptr<SortOrder> LogSortOptions::getAuthor() const
{
    return m_Author;
}

void LogSortOptions::setAuthor(const std::shared_ptr<SortOrder>& value)
{
    m_Author = value;
    m_AuthorIsSet = true;
}

bool LogSortOptions::authorIsSet() const
{
    return m_AuthorIsSet;
}

void LogSortOptions::unsetAuthor()
{
    m_AuthorIsSet = false;
}
std::shared_ptr<SortOrder> LogSortOptions::getCreatedAt() const
{
    return m_CreatedAt;
}

void LogSortOptions::setCreatedAt(const std::shared_ptr<SortOrder>& value)
{
    m_CreatedAt = value;
    m_CreatedAtIsSet = true;
}

bool LogSortOptions::createdAtIsSet() const
{
    return m_CreatedAtIsSet;
}

void LogSortOptions::unsetCreatedAt()
{
    m_CreatedAtIsSet = false;
}
std::shared_ptr<SortOrder> LogSortOptions::getId() const
{
    return m_Id;
}

void LogSortOptions::setId(const std::shared_ptr<SortOrder>& value)
{
    m_Id = value;
    m_IdIsSet = true;
}

bool LogSortOptions::idIsSet() const
{
    return m_IdIsSet;
}

void LogSortOptions::unsetId()
{
    m_IdIsSet = false;
}
std::shared_ptr<SortOrder> LogSortOptions::getTags() const
{
    return m_Tags;
}

void LogSortOptions::setTags(const std::shared_ptr<SortOrder>& value)
{
    m_Tags = value;
    m_TagsIsSet = true;
}

bool LogSortOptions::tagsIsSet() const
{
    return m_TagsIsSet;
}

void LogSortOptions::unsetTags()
{
    m_TagsIsSet = false;
}
std::shared_ptr<SortOrder> LogSortOptions::getTitle() const
{
    return m_Title;
}

void LogSortOptions::setTitle(const std::shared_ptr<SortOrder>& value)
{
    m_Title = value;
    m_TitleIsSet = true;
}

bool LogSortOptions::titleIsSet() const
{
    return m_TitleIsSet;
}

void LogSortOptions::unsetTitle()
{
    m_TitleIsSet = false;
}
}
}
}
}

